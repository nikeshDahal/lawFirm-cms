import { useEffect, useRef, useState } from 'react';
import { useGQL } from '../../hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorMessage, FieldArray, Formik, useFormikContext } from 'formik';
import { v4 as uuid } from 'uuid';
import MainCard from 'ui-component/cards/MainCard';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Button,
    Grid,
    TextField,
    Typography,
    FormHelperText,
    Box,
    Stack,
    InputLabel,
    Select,
    OutlinedInput,
    Chip,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    IconButton
} from '@mui/material';
import { TaskTemplateStatus, validationSchema, validationSchemaForUpdate } from 'views/preset-template/constants/variables';
import { PresetTemplateListRoute, TaskTemplateAdd } from 'constants/routePaths';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toWords } from 'number-to-words';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { allowedImageTypes, fileSize } from 'views/profile/constant/constant';
import { CreateTemplateInput, PresetTemplate, PresetTemplateStatusEnum } from 'views/preset-template/constants/types';
import { base64ToBlob } from 'utils/base64ToBlob';
import blobUploadHelper from 'utils/blogUploader';
import { PATH_FOR_TASK_TEMPLATE } from 'constants/S3ImagePaths';
import { ImageCropperModalCustomized } from 'components/modal/customizedCropperModal';
import CustomLoader from 'components/loader';
import FailureLoad from 'components/spinner/fail';
import { ImagePreviewModal } from 'components/modal/imagePreview-modal';
import { useCategories } from 'hooks/useCategories';
import { Category } from 'store/slices/category';
import { RootState } from 'store';
import { useSelector } from 'react-redux';

// DND Kit Imports
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { convertTimestampToFloat } from 'utils/time-formatter';
const EditTaskTemplateComponent = () => {
    const navigate = useNavigate();
    const formRef = useRef<any>();
    const breadcrumbLinks = [{ title: 'Task templates', to: PresetTemplateListRoute }, { title: 'Edit task template' }];
    const { handleOpenSnackbar } = useSnackbar();
    const { id } = useParams();
    const { data: categories, lastFetched } = useSelector((state: RootState) => state.category);
    /** states handling */
    const [template, setTemplate] = useState<Partial<PresetTemplate>>();
    const [openCropper, setOpenCropper] = useState(false);
    const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
    const [croppedImages, setCroppedImages] = useState<Record<number, { base64: string; imageType: string }>>({});
    const [tempImage, setTempImage] = useState<{ base64: string; imageType: string } | null>(null);
    const [previewImageOpen, setPreviewImageOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [isSubmit, setSubmitForm] = useState<boolean>(false);
    const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

    /** graphql hooks */
    const { IMAGE_UPLOAD, GET_TEMPLATE, UPDATE_TEMPLATE, DELETE_IMAGE } = useGQL();
    const { error, loading, data: templateData, refetch } = GET_TEMPLATE(id!);
    const [handleImageUpload] = IMAGE_UPLOAD();

    const [handleDeleteTaskTemplate, { data: deletedData, loading: RemoveLoading, error: removeError }] = DELETE_IMAGE();
    const [handleUpdateTaskTemplate, { data, loading: UpdateLoading }] = UPDATE_TEMPLATE();

    // DND Kit Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 500, // 500ms delay for long press
                tolerance: 5 // 5px tolerance
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );
    const handleRemoveImage = async (index: number) => {
        setLoadingImages((prev) => ({ ...prev, [index]: true }));

        if (croppedImages[index]) {
            setCroppedImages((prev) => {
                const updatedImages = { ...prev };
                delete updatedImages[index];
                return updatedImages;
            });
        } else {
            try {
                const response = await handleDeleteTaskTemplate({ variables: { templateId: id!, index } });
                if (response?.data?.deleteTaskStepImage?.message) {
                    refetch();
                    handleOpenSnackbar({ message: response?.data?.deleteTaskStepImage?.message, alertType: 'success' });
                }
            } catch (err: any) {
                handleOpenSnackbar({ message: err.message, alertType: 'error' });
            }
        }

        setLoadingImages((prev) => ({ ...prev, [index]: false }));
    };

    const taskCategories = categories?.map((category) => ({
        id: category?._id,
        categoryName: category?.categoryName,
        imageKey: category?.icon
    }));
    useEffect(() => {
        if (templateData?.getTaskDetailById) {
            setTemplate(templateData?.getTaskDetailById?.task || {});
        }
    }, [templateData]);

    useEffect(() => {
        if (data?.updateTaskTemplate) {
            handleOpenSnackbar({ message: `${data?.updateTaskTemplate?.message!}. Redirecting...`, alertType: 'success' });
            refetch();
            navigate(PresetTemplateListRoute);
        }
    }, [data]);

    const handleFormSubmit = async (values: any, setSubmitting?: (isSubmitting: boolean) => void) => {
        try {
            const { _id, createdAt, updatedAt, taskStepCount, templateType, downloads, taskStep, ...others } = values;
            const sanitizedTaskStep =
                taskStep?.map(({ imageUrl, timer, timerInTimeStamp, ...step }) => ({
                    ...step,
                    timer: timerInTimeStamp ? convertTimestampToFloat(timerInTimeStamp) : null,
                    timerInTimeStamp: timerInTimeStamp ? timerInTimeStamp : null
                })) || [];
            setSubmitForm(true);
            await handleUpdateTaskTemplate({
                variables: {
                    input: {
                        taskId: _id,
                        ...others,
                        taskStep: sanitizedTaskStep
                    }
                }
            });
            setSubmitForm(false);
            refetch();
        } catch (err) {
            handleOpenSnackbar({ message: data?.createTask?.message!, alertType: 'error' });
        }

        setSubmitForm(false);
    };

    const handleSelectProfileImage = async (event, index) => {
        const fileInput = event.target;
        const file = event.target.files?.[0];
        if (!file) return;

        if (!allowedImageTypes.includes(file.type)) {
            handleOpenSnackbar({ message: 'Only JPG, JPEG, or PNG are allowed.', alertType: 'error' });
            fileInput.value = ''; // Reset file input to allow selecting again
            return;
        }

        if (file.size > fileSize) {
            handleOpenSnackbar({ message: 'Image size must not exceed 2 MB.', alertType: 'error' });
            fileInput.value = ''; // Reset file input
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setCroppedImages((prev) => ({
                ...prev,
                [index]: { base64: reader.result as string, imageType: file.type }
            })); // Update state properly

            setOpenCropper(true);
            setSelectedStepIndex(index);
            setTempImage({ base64: reader.result as string, imageType: file.type });
        };
        reader.readAsDataURL(file);
    };

    const handleSaveIncludingImage = async (values: Partial<PresetTemplate>, setSubmitting?) => {
        setSubmitForm(true);

        if (values?.taskStep) {
            try {
                const updatedTaskSteps = await Promise.all(
                    values.taskStep.map(async (step, index) => {
                        if (croppedImages[index]) {
                            const { base64, imageType } = croppedImages[index];
                            if (!base64 || !imageType) {
                                return { ...step, imageKey: null };
                            }

                            const blob = base64ToBlob(base64, imageType);
                            const imageExt = imageType.split('/').pop();
                            const filename = `${PATH_FOR_TASK_TEMPLATE}/${uuid()}.${imageExt}`;
                            const key = await blobUploadHelper(blob, handleImageUpload, filename, imageType);

                            return { ...step, imageKey: key?.fileDetails?.name! };
                        } else if (!step.imageKey) {
                            return { ...step, imageKey: null };
                        }

                        return { ...step };
                    })
                );

                const updatedValues = {
                    ...values,
                    taskStep: updatedTaskSteps
                };

                handleFormSubmit(updatedValues, setSubmitting);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handlePreview = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl); // Store the clicked image
        setPreviewImageOpen(true);
    };

    return (
        <>
            {loading || UpdateLoading || !template ? (
                <CustomLoader />
            ) : error ? (
                <FailureLoad />
            ) : (
                <>
                    <Stack className="custom-breadcrumb">
                        <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
                    </Stack>
                    <Formik
                        innerRef={formRef}
                        enableReinitialize
                        initialValues={template!}
                        validationSchema={validationSchemaForUpdate}
                        onSubmit={(values, { setSubmitting }) => {
                            handleSaveIncludingImage(values, setSubmitting);
                        }}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => {
                            const handleDragEnd = (event) => {
                                const { active, over } = event;
                                if (active.id !== over.id) {
                                    const oldIndex = active?.id; // active.id is the index
                                    const newIndex = over?.id; // over.id is the index

                                    // Ensure values.taskStep is an array before passing it to arrayMove
                                    const taskSteps = values.taskStep || [];
                                    const newSteps = arrayMove(taskSteps, oldIndex, newIndex);
                                    setFieldValue('taskStep', newSteps);
                                }
                            };

                            return (
                                <form onSubmit={handleSubmit}>
                                    <MainCard
                                        title={
                                            <Grid
                                                container
                                                justifyContent={{ md: 'space-between' }}
                                                alignItems={{ md: 'center' }}
                                                spacing={2}
                                            >
                                                <Grid item xs={12} md={5}>
                                                    <Typography variant="h2">Edit task template</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={7}>
                                                    <Stack>
                                                        <Button disabled={isSubmit} variant="contained" type="submit">
                                                            Save and Add
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        }
                                    >
                                        <Grid container item xs={12} spacing={2} sx={{ marginBottom: '1rem' }}>
                                            <Grid item xs={6}>
                                                <InputLabel>Template name</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="taskName"
                                                    placeholder="Enter template name"
                                                    value={values?.taskName}
                                                    name="taskName"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched.taskName && errors.taskName && (
                                                    <FormHelperText error id="taskName-error">
                                                        {errors.taskName}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid item xs={6} sx={{ fontSize: 0, lineHeight: 1 }}>
                                                <InputLabel>Template category</InputLabel>
                                                <Select
                                                    fullWidth
                                                    multiple
                                                    id="taskCategory"
                                                    name="taskCategory"
                                                    value={values?.taskCategory?.map((cat) => cat.id) || []}
                                                    onBlur={handleBlur}
                                                    onChange={(event) => {
                                                        const selectedIds = event.target.value;
                                                        if (selectedIds.length > 3) return;

                                                        const selectedCategories = taskCategories.filter((category) =>
                                                            selectedIds.includes(category.id)
                                                        );

                                                        handleChange({
                                                            target: {
                                                                name: 'taskCategory',
                                                                value: selectedCategories || [] // Ensure value is always an array
                                                            }
                                                        });
                                                    }}
                                                    input={<OutlinedInput />}
                                                    renderValue={(selected) =>
                                                        selected.length === 0 ? (
                                                            'Select categories'
                                                        ) : (
                                                            <div>
                                                                {selected.map((id) => {
                                                                    const category = taskCategories.find((cat) => cat.id === id);
                                                                    return category ? (
                                                                        <Chip
                                                                            key={id}
                                                                            label={category.categoryName}
                                                                            style={{ margin: 2 }}
                                                                        />
                                                                    ) : null;
                                                                })}
                                                            </div>
                                                        )
                                                    }
                                                >
                                                    {taskCategories.map((category) => (
                                                        <MenuItem
                                                            key={category.id}
                                                            value={category.id}
                                                            disabled={
                                                                (values?.taskCategory?.length || 0) >= 3 &&
                                                                !values?.taskCategory?.some((cat) => cat.id === category.id)
                                                            }
                                                        >
                                                            {category.categoryName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>

                                                {touched.taskCategory && errors.taskCategory && (
                                                    <FormHelperText error id="taskCategory-error">
                                                        {typeof errors.taskCategory === 'string'
                                                            ? errors.taskCategory
                                                            : 'At least one category is required'}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={6}>
                                                <InputLabel>Status</InputLabel>
                                                <TextField
                                                    id="userStatus"
                                                    name="status"
                                                    select
                                                    value={values.status}
                                                    fullWidth
                                                    onChange={handleChange}
                                                >
                                                    {TaskTemplateStatus.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                {touched.status && errors.status && (
                                                    <FormHelperText error id="userStatus-error">
                                                        {errors.status}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                    <FieldArray name="taskStep">
                                        {({ push, remove }) => (
                                            <>
                                                <DndContext
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    onDragEnd={handleDragEnd}
                                                    modifiers={[restrictToVerticalAxis]}
                                                >
                                                    <SortableContext
                                                        items={(values.taskStep ?? []).map((_, index) => index)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        {(values.taskStep ?? []).map((step, index) => (
                                                            <SortableStep
                                                                key={index}
                                                                id={index} // Use index as id
                                                                index={index}
                                                                step={step}
                                                                values={values}
                                                                errors={errors}
                                                                touched={touched}
                                                                setFieldValue={setFieldValue}
                                                                handleRemoveImage={handleRemoveImage}
                                                                croppedImages={croppedImages}
                                                                loadingImages={loadingImages}
                                                                handleSelectProfileImage={handleSelectProfileImage}
                                                                handlePreview={handlePreview}
                                                                previewImageOpen={previewImageOpen}
                                                                selectedImageUrl={selectedImageUrl}
                                                                openCropper={openCropper}
                                                                selectedStepIndex={selectedStepIndex}
                                                                tempImage={tempImage}
                                                                setOpenCropper={setOpenCropper}
                                                                setSelectedStepIndex={setSelectedStepIndex}
                                                                setTempImage={setTempImage}
                                                                remove={remove}
                                                                setCroppedImages={setCroppedImages}
                                                                setPreviewImageOpen={setPreviewImageOpen}
                                                                push={push}
                                                            />
                                                        ))}
                                                    </SortableContext>
                                                </DndContext>
                                                <Paper className="form-button-wrapper">
                                                    <Grid item xs={12}>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                push({ stepName: '', timer: null, imageKey: '' });

                                                                setCroppedImages((prev) => {
                                                                    const updatedImages = { ...prev };
                                                                    return Object.values(updatedImages);
                                                                });
                                                            }}
                                                        >
                                                            Add next step
                                                        </Button>
                                                    </Grid>
                                                </Paper>
                                            </>
                                        )}
                                    </FieldArray>
                                </form>
                            );
                        }}
                    </Formik>
                </>
            )}
        </>
    );
};

const SortableStep = ({
    id,
    index,
    step,
    values,
    touched,
    errors,
    setFieldValue,
    handleRemoveImage,
    croppedImages,
    loadingImages,
    handleSelectProfileImage,
    handlePreview,
    previewImageOpen,
    selectedImageUrl,
    openCropper,
    selectedStepIndex,
    tempImage,
    setOpenCropper,
    setSelectedStepIndex,
    setTempImage,
    remove,
    setPreviewImageOpen,
    setCroppedImages,
    push
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    return (
        <Paper
            className="form-button-wrapper"
            ref={setNodeRef}
            sx={{
                transform: CSS.Transform.toString(transform),
                transition: transition || 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                boxShadow: isDragging ? '0px 5px 14px rgba(0, 0, 0, 0.2)' : 'none',
                zIndex: isDragging ? 1 : 0,
                position: 'relative',
                width: '100%',
                height: 'auto', // Ensure the height adjusts based on content
                marginBottom: '16px', // Add some margin between items
                ...(isDragging && {
                    transform: `${CSS.Transform.toString(transform)} translateY(-5px)` // Lift the item slightly
                })
            }}
            {...attributes}
            {...listeners}
        >
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
                    <Typography variant="h4">{`Step ${toWords(index + 1)}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Step name</InputLabel>
                            <TextField
                                fullWidth
                                id="taskStep"
                                placeholder="Enter step name"
                                name={`taskStep[${index}].stepName`}
                                value={step.stepName}
                                onChange={(e) => setFieldValue(`taskStep[${index}].stepName`, e.target.value)}
                                onKeyDown={(e) => {
                                    e.stopPropagation(); // Prevents @dnd-kit from detecting Backspace
                                }}
                            />

                            <FormHelperText error id="title-error">
                                <ErrorMessage name={`taskStep[${index}].stepName`} />
                            </FormHelperText>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Timer</InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    sx={{ width: '100%' }}
                                    views={['minutes', 'seconds']}
                                    format="mm:ss"
                                    name={`taskStep[${index}].timerInTimeStamp`}
                                    value={step.timerInTimeStamp ? dayjs(step.timerInTimeStamp) : null}
                                    onChange={(newValue) =>
                                        setFieldValue(`taskStep[${index}].timerInTimeStamp`, newValue ? dayjs(newValue) : null)
                                    }
                                />
                            </LocalizationProvider>
                            <FormHelperText error id="title-error">
                                <ErrorMessage name={`taskStep[${index}].timerInTimeStamp`} />
                            </FormHelperText>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel>Upload Image</InputLabel>
                            <Box
                                sx={{
                                    border: '2px dashed #000CA4',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '184px',
                                    width: '100%',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundImage: croppedImages[index]?.base64
                                        ? `url(${croppedImages[index].base64})`
                                        : step.imageUrl
                                          ? `url(${step.imageUrl})`
                                          : 'none',
                                    position: 'relative'
                                }}
                                onClick={() => document.getElementById(`fileInput-${index}`)?.click()}
                            >
                                {loadingImages[index] ? (
                                    <CustomLoader />
                                ) : (
                                    <>
                                        {!croppedImages[index]?.base64 && !step.imageKey && (
                                            <>
                                                <CloudUploadIcon sx={{ fontSize: 40, color: '#2E6DE5' }} />
                                                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                                                    Click to upload any files (max 2MB).
                                                    <br />
                                                    <strong>Only JPG, JPEG, or PNG are allowed.</strong>
                                                </Typography>
                                            </>
                                        )}

                                        {(croppedImages[index]?.base64 || step.imageUrl) && (
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 1)'
                                                    }
                                                }}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleRemoveImage(index);
                                                }}
                                            >
                                                <DeleteIcon sx={{ color: '#ff0000' }} />
                                            </IconButton>
                                        )}

                                        <input
                                            id={`fileInput-${index}`}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(event) => handleSelectProfileImage(event, index)}
                                        />
                                    </>
                                )}
                            </Box>
                            {!croppedImages[index]?.base64 && (
                                <FormHelperText error>
                                    <ErrorMessage name={'Required'} />
                                </FormHelperText>
                            )}
                        </Grid>
                        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {step?.imageUrl && (
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        handlePreview(croppedImages[index]?.base64 ? croppedImages[index]?.base64 : step.imageUrl!)
                                    }
                                >
                                    Preview
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                    {previewImageOpen && selectedImageUrl && (
                        <ImagePreviewModal
                            open={previewImageOpen}
                            setOpen={setPreviewImageOpen}
                            title="Image Preview"
                            imageUrl={selectedImageUrl}
                        />
                    )}
                    {openCropper && selectedStepIndex !== null && (
                        <ImageCropperModalCustomized
                            open={openCropper}
                            setOpen={setOpenCropper}
                            base64Image={tempImage?.base64 || ''}
                            setCroppedImage={(base64, imageType) => {
                                if (selectedStepIndex !== null) {
                                    setCroppedImages((prev) => ({
                                        ...prev,
                                        [selectedStepIndex]: { base64, imageType }
                                    }));
                                }
                            }}
                            title="Crop Image"
                            squareImage={true}
                            setSelectedStepIndex={setSelectedStepIndex}
                            tempImage={tempImage}
                            setTempImage={setTempImage}
                        />
                    )}

                    {index > 0 && (
                        <Button
                            sx={{ marginTop: '1rem' }}
                            type="button"
                            variant="outlined"
                            onClick={() => {
                                remove(index);
                                setCroppedImages((prev) => {
                                    const updatedImages = { ...prev };
                                    delete updatedImages[index]; // Remove the image associated with the step
                                    return updatedImages;
                                });
                            }}
                        >
                            Remove Step
                        </Button>
                    )}
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};

export default EditTaskTemplateComponent;
