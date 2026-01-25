import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGQL } from '../../hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import { ErrorMessage, FieldArray, Formik } from 'formik';
import { v4 as uuid } from 'uuid';
import MainCard from 'ui-component/cards/MainCard';
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
    IconButton,
    CircularProgress
} from '@mui/material';
import { initialValues, validationSchema } from 'views/preset-template/constants/variables';
import { PresetTemplateListRoute } from 'constants/routePaths';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toWords } from 'number-to-words';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { allowedImageTypes, fileSize } from 'views/profile/constant/constant';
import { CreateTemplateInput, PresetTemplateStatusEnum, PresetTemplate } from 'views/preset-template/constants/types';
import { base64ToBlob } from 'utils/base64ToBlob';
import blobUploadHelper from 'utils/blogUploader';
import { PATH_FOR_TASK_TEMPLATE } from 'constants/S3ImagePaths';
import { ImageCropperModalCustomized } from 'components/modal/customizedCropperModal';
import CustomLoader from 'components/loader';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import DeleteIcon from '@mui/icons-material/Delete';
import { convertTimestampToFloat } from 'utils/time-formatter';
import { image } from 'html2canvas/dist/types/css/types/image';

interface ImageUploadFieldProps {
    index: number;
    croppedImage: { base64: string; imageType: string } | null | undefined;
    imageKey: string | undefined;
    imageUrl?: string;
    handleSelectProfileImage: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    handleRemoveImage: (index: number) => void;
    loading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

const ImageUploadField = React.memo<ImageUploadFieldProps>(
    ({ index, croppedImage, imageKey, imageUrl, handleSelectProfileImage, handleRemoveImage, loading, fileInputRef }) => {
        const handleClick = () => {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
                fileInputRef.current.click();
            }
        };
        console.log('imageKey', imageKey);
        console.log('imageUrl', imageUrl);
        return (
            <>
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
                        backgroundColor: '#ffffff',
                        backgroundImage: croppedImage?.base64 ? `url(${croppedImage.base64})` : imageUrl ? `url(${imageUrl})` : 'none',
                        position: 'relative'
                    }}
                    onClick={handleClick}
                >
                    {!croppedImage?.base64 && !imageKey && (
                        <>
                            <CloudUploadIcon sx={{ fontSize: 40, color: '#2E6DE5' }} />
                            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                                Click to upload any files (max 2MB).
                                <br />
                                <strong>Only JPG, JPEG, or PNG are allowed.</strong>
                            </Typography>
                        </>
                    )}

                    {(croppedImage?.base64 || imageKey) && !loading && (
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

                    {loading && (
                        <CircularProgress
                            size={40}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-20px',
                                marginLeft: '-20px'
                            }}
                        />
                    )}

                    <input
                        id={`fileInput-${index}`}
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(event) => handleSelectProfileImage(event, index)}
                    />
                </Box>
            </>
        );
    }
);

type Step = {
    stepName: string;
    timerInTimeStamp: string | null;
    imageKey?: string;
};

interface StepComponentProps {
    index: number;
    step: Step;
    croppedImage: { base64: string; imageType: string } | null;
    imageKey: string | undefined;
    imageUrl?: string;
    handleSelectProfileImage: (event: React.ChangeEvent<HTMLInputElement>, index: number) => Promise<void>;
    handleRemoveImage: (index: number) => void;
    loading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    setFieldValue: (field: string, value: any) => void;
    remove: () => void;
    showRemove: boolean;
}

const StepComponent = React.memo(
    ({
        index,
        step,
        croppedImage,
        imageKey,
        imageUrl,
        handleSelectProfileImage,
        handleRemoveImage,
        loading,
        fileInputRef,
        setFieldValue,
        remove,
        showRemove
    }: StepComponentProps) => {
        const [localStepName, setLocalStepName] = useState(step.stepName);
        const [localTimer, setLocalTimer] = useState(step.timerInTimeStamp ? dayjs(step.timerInTimeStamp) : null);

        useEffect(() => {
            const timeout = setTimeout(() => {
                setFieldValue(`taskStep[${index}].stepName`, localStepName);
            }, 150);
            return () => clearTimeout(timeout);
        }, [localStepName, index, setFieldValue]);

        const handleTimerChange = useCallback(
            (newValue) => {
                setLocalTimer(newValue);
                setFieldValue(`taskStep[${index}].timerInTimeStamp`, newValue ? dayjs(newValue) : null);
            },
            [index, setFieldValue]
        );

        return (
            <Paper
                className="form-button-wrapper"
                sx={{
                    mb: 2,
                    backgroundColor: 'background.paper'
                }}
            >
                <Accordion defaultExpanded sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
                        <Typography variant="h4">{`Step ${toWords(index + 1)}`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Step name</InputLabel>
                                <TextField fullWidth value={localStepName} onChange={(e) => setLocalStepName(e.target.value)} />
                                <FormHelperText error>
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
                                        value={localTimer}
                                        onChange={handleTimerChange}
                                    />
                                </LocalizationProvider>
                                <FormHelperText error>
                                    <ErrorMessage name={`taskStep[${index}].timerInTimeStamp`} />
                                </FormHelperText>
                            </Grid>
                            <Grid item xs={6}>
                                <ImageUploadField
                                    index={index}
                                    croppedImage={croppedImage}
                                    imageKey={imageKey}
                                    imageUrl={imageUrl}
                                    handleSelectProfileImage={handleSelectProfileImage}
                                    handleRemoveImage={handleRemoveImage}
                                    loading={loading}
                                    fileInputRef={fileInputRef}
                                />
                            </Grid>
                        </Grid>
                        {showRemove && (
                            <Button
                                sx={{ mt: 2 }}
                                type="button"
                                variant="outlined"
                                onClick={(event) => {
                                    remove();
                                }}
                            >
                                Remove Step
                            </Button>
                        )}
                    </AccordionDetails>
                </Accordion>
            </Paper>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.index === nextProps.index &&
            prevProps.step.stepName === nextProps.step.stepName &&
            prevProps.step.timerInTimeStamp === nextProps.step.timerInTimeStamp &&
            prevProps.croppedImage === nextProps.croppedImage &&
            prevProps.imageKey === nextProps.imageKey &&
            prevProps.loading === nextProps.loading &&
            prevProps.showRemove === nextProps.showRemove
        );
    }
);

const TaskTemplateComponent = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const formRef = useRef<any>();
    const { handleOpenSnackbar } = useSnackbar();
    const { data: categories } = useSelector((state: RootState) => state.category);
    const isEditMode = !!id;

    // State management
    const [openCropper, setOpenCropper] = useState(false);
    const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
    const [croppedImages, setCroppedImages] = useState<Record<string, { base64: string; imageType: string }>>({});
    const [tempImage, setTempImage] = useState<{ base64: string; imageType: string } | null>(null);
    const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
    const fileInputRefs = useRef<Record<number, React.RefObject<HTMLInputElement>>>({});

    // GraphQL hooks
    const { IMAGE_UPLOAD, CREATE_TEMPLATE, UPDATE_TEMPLATE, GET_TEMPLATE } = useGQL();
    const [handleImageUpload] = IMAGE_UPLOAD();
    const [handleCreateTaskTemplate, { data: createData, loading: createLoading }] = CREATE_TEMPLATE();
    const [handleUpdateTaskTemplate, { data: updateData, loading: updateLoading }] = UPDATE_TEMPLATE();
    const { error, loading: fetchLoading, data: templateData, refetch } = GET_TEMPLATE(id!);

    const loading = createLoading || updateLoading || fetchLoading;

    const initialFormValues = useMemo(() => {
        if (isEditMode && templateData?.getTaskDetailById?.task) {
            const task = templateData.getTaskDetailById.task;
            return {
                taskName: task.taskName,
                taskCategory: task.taskCategory || [],
                taskStep: task.taskStep?.map((step) => ({
                    id: step.id || uuid(),
                    stepName: step.stepName,
                    timerInTimeStamp: step.timerInTimeStamp ? dayjs(step.timerInTimeStamp) : null,
                    imageKey: step.imageKey || '',
                    imageUrl: step?.imageUrl || ''
                })) || [{ id: uuid(), stepName: '', timerInTimeStamp: null, imageKey: '' }],
                status: task.status || PresetTemplateStatusEnum.Active
            };
        }

        return {
            ...initialValues,
            status: PresetTemplateStatusEnum.Active
        };
    }, [isEditMode, templateData]);

    const breadcrumbLinks = useMemo(
        () => [
            { title: 'Task template management', to: PresetTemplateListRoute },
            { title: isEditMode ? 'Edit task template' : 'Add new task template' }
        ],
        [isEditMode]
    );

    const taskCategories = useMemo(
        () =>
            categories?.map((category) => ({
                id: category?._id,
                categoryName: category?.categoryName,
                imageKey: category?.icon
            })) || [],
        [categories]
    );

    // Effects
    useEffect(() => {
        if (createData?.createTask) {
            handleOpenSnackbar({ message: `${createData.createTask.message}. Redirecting...`, alertType: 'success' });
            navigate(PresetTemplateListRoute);
        }

        if (updateData?.updateTaskTemplate) {
            refetch();
            handleOpenSnackbar({ message: updateData.updateTaskTemplate.message, alertType: 'success' });
            navigate(PresetTemplateListRoute);
        }

        if (error) {
            handleOpenSnackbar({ message: 'Failed to fetch template data', alertType: 'error' });
        }
    }, [createData, updateData, error, handleOpenSnackbar, navigate]);

    // Handlers
    const handleFormSubmit = useCallback(
        async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
            try {
                const { taskStep, ...others } = values;
                const sanitizedTaskStep =
                    taskStep?.map(({ id, imageUrl, timerInTimeStamp, ...step }) => ({
                        ...step,
                        id: isEditMode ? id : undefined, // Only send ID for edit mode
                        timer: timerInTimeStamp ? convertTimestampToFloat(timerInTimeStamp) : null,
                        timerInTimeStamp: timerInTimeStamp ? timerInTimeStamp : null
                    })) || [];

                setSubmitting(true);

                const input = {
                    ...others,
                    taskStep: sanitizedTaskStep,
                    status: values.status || PresetTemplateStatusEnum.Active
                };

                if (isEditMode && id) {
                    await handleUpdateTaskTemplate({
                        variables: { input: { ...input, taskId: id } }
                    });
                } else {
                    await handleCreateTaskTemplate({
                        variables: { input }
                    });
                }
                setSubmitting(false);
            } catch (err) {
                handleOpenSnackbar({
                    message: isEditMode ? 'Failed to update task template' : 'Failed to create task template',
                    alertType: 'error'
                });
                setSubmitting(false);
            }
        },
        [isEditMode, id, handleCreateTaskTemplate, handleUpdateTaskTemplate, handleOpenSnackbar]
    );

    const handleSelectProfileImage = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
            const fileInput = event.target;
            const file = event.target.files?.[0];
            if (!file) return;

            if (!allowedImageTypes.includes(file.type)) {
                handleOpenSnackbar({ message: 'Only JPG, JPEG, or PNG are allowed.', alertType: 'error' });
                fileInput.value = '';
                return;
            }

            if (file.size > fileSize) {
                handleOpenSnackbar({ message: 'Image size must not exceed 2 MB.', alertType: 'error' });
                fileInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setCroppedImages((prev) => ({
                    ...prev,
                    [index]: { base64: reader.result as string, imageType: file.type }
                }));
                setOpenCropper(true);
                setSelectedStepIndex(index);
                setTempImage({ base64: reader.result as string, imageType: file.type });
            };
            reader.readAsDataURL(file);
        },
        [handleOpenSnackbar]
    );

    const handleSaveIncludingImage = useCallback(
        async (values: Partial<CreateTemplateInput>, setSubmitting: (isSubmitting: boolean) => void) => {
            setSubmitting(true);

            if (values?.taskStep) {
                try {
                    for (const [index, step] of values.taskStep.entries()) {
                        if (croppedImages[index]) {
                            const { base64, imageType } = croppedImages[index];
                            const blob = base64ToBlob(base64, imageType);
                            const imageExt = imageType.split('/').pop();
                            const filename = `${PATH_FOR_TASK_TEMPLATE}/${uuid()}.${imageExt}`;
                            const key = await blobUploadHelper(blob, handleImageUpload, filename, imageType);
                            step.imageKey = key?.fileDetails?.name!;
                        }
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
            handleFormSubmit(values, setSubmitting);
        },
        [croppedImages, handleFormSubmit, handleImageUpload]
    );

    const handleRemoveImage = useCallback((index: number, setFieldValue?: (field: string, value: any) => void) => {
        setLoadingImages((prev) => ({ ...prev, [index]: true }));

        if (fileInputRefs.current[index]?.current) {
            fileInputRefs.current[index].current!.value = '';
        }

        setCroppedImages((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });

        // clear in Formik values
        if (setFieldValue) {
            setFieldValue(`taskStep[${index}].imageKey`, '');
            setFieldValue(`taskStep[${index}].imageUrl`, '');
        }

        delete fileInputRefs.current[index];

        setLoadingImages((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });
    }, []);

    const adjustIndicesAfterRemoval = (removedIndex: number) => {
        setCroppedImages((prev) => {
            const updated = { ...prev };
            const entries = Object.entries(updated)
                .map(([key, value]) => ({ index: Number(key), value }))
                .filter(({ index }) => index !== removedIndex)
                .map(({ index, value }) => ({
                    newIndex: index > removedIndex ? index - 1 : index,
                    value
                }));

            const newState = {};
            entries.forEach(({ newIndex, value }) => {
                newState[newIndex] = value;
            });
            return newState;
        });

        const newRefs = {};
        Object.entries(fileInputRefs.current)
            .map(([key, value]) => ({ index: Number(key), value }))
            .filter(({ index }) => index !== removedIndex)
            .forEach(({ index, value }) => {
                newRefs[index > removedIndex ? index - 1 : index] = value;
            });
        fileInputRefs.current = newRefs;

        setLoadingImages((prev) => {
            const updated = { ...prev };
            const entries = Object.entries(updated)
                .map(([key, value]) => ({ index: Number(key), value }))
                .filter(({ index }) => index !== removedIndex)
                .map(({ index, value }) => ({
                    newIndex: index > removedIndex ? index - 1 : index,
                    value
                }));

            const newState = {};
            entries.forEach(({ newIndex, value }) => {
                newState[newIndex] = value;
            });
            return newState;
        });
    };

    const getFileInputRef = useCallback((index: number) => {
        if (!fileInputRefs.current[index]) {
            fileInputRefs.current[index] = React.createRef<HTMLInputElement>();
        }
        return fileInputRefs.current[index];
    }, []);

    const renderForm = useCallback(
        ({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => {
            return (
                <form onSubmit={handleSubmit}>
                    <MainCard
                        title={
                            <Grid container justifyContent={{ md: 'space-between' }} alignItems={{ md: 'center' }} spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <Typography variant="h2">{isEditMode ? 'Edit Task Template' : 'Add New Task Template'}</Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Stack>
                                        <Button disabled={isSubmitting} variant="contained" type="submit">
                                            {isEditMode ? 'Update Template' : 'Save and Add'}
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
                                    placeholder="Enter task name"
                                    value={values.taskName}
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
                                    value={values.taskCategory?.map((cat) => cat.id) || []}
                                    onBlur={handleBlur}
                                    onChange={(event) => {
                                        const selectedIds = event.target.value;
                                        if (selectedIds.length > 3) return;
                                        const selectedCategories = taskCategories.filter((category) => selectedIds.includes(category.id));
                                        handleChange({
                                            target: {
                                                name: 'taskCategory',
                                                value: selectedCategories
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
                                                    return category ? <Chip key={id} label={category.categoryName} /> : null;
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
                                                values.taskCategory.length >= 3 &&
                                                !values.taskCategory.some((cat) => cat.id === category.id)
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
                        </Grid>
                    </MainCard>
                    <FieldArray name="taskStep">
                        {({ push, remove }) => (
                            <>
                                {values.taskStep.map((step, index) => {
                                    const fileInputRef = getFileInputRef(index);
                                    const handleStepRemove = () => {
                                        handleRemoveImage(index);
                                        adjustIndicesAfterRemoval(index);
                                        remove(index);
                                    };
                                    return (
                                        <StepComponent
                                            key={step.id}
                                            index={index}
                                            step={step}
                                            croppedImage={croppedImages[index]}
                                            imageKey={step.imageKey}
                                            imageUrl={step.imageUrl}
                                            handleSelectProfileImage={handleSelectProfileImage}
                                            handleRemoveImage={(idx) => handleRemoveImage(idx, setFieldValue)}
                                            loading={loadingImages[index] || false}
                                            fileInputRef={fileInputRef}
                                            setFieldValue={setFieldValue}
                                            remove={handleStepRemove}
                                            showRemove={index > 0}
                                        />
                                    );
                                })}
                                <Paper sx={{ p: 2, mt: 2 }}>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={() => push({ id: uuid(), stepName: '', timer: null, imageKey: '' })}
                                    >
                                        Add next step
                                    </Button>
                                </Paper>
                            </>
                        )}
                    </FieldArray>
                </form>
            );
        },
        [croppedImages, getFileInputRef, handleRemoveImage, handleSelectProfileImage, loadingImages, isEditMode, taskCategories]
    );

    return (
        <>
            {loading ? (
                <CustomLoader />
            ) : (
                <>
                    <Stack className="custom-breadcrumb">
                        <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
                    </Stack>
                    <Formik
                        innerRef={formRef}
                        enableReinitialize
                        initialValues={initialFormValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            // Ensure timerInTimeStamp is always a Date or null
                            const sanitizedValues = {
                                ...values,
                                taskStep: values.taskStep.map((step) => ({
                                    ...step,
                                    timerInTimeStamp:
                                        step.timerInTimeStamp &&
                                        typeof step.timerInTimeStamp === 'object' &&
                                        'toDate' in step.timerInTimeStamp
                                            ? (step.timerInTimeStamp as dayjs.Dayjs).toDate()
                                            : (step.timerInTimeStamp ?? null)
                                })),
                                status: values?.status as PresetTemplateStatusEnum
                            };
                            handleSaveIncludingImage(sanitizedValues, setSubmitting);
                        }}
                    >
                        {renderForm}
                    </Formik>

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
                </>
            )}
        </>
    );
};

export default TaskTemplateComponent;
