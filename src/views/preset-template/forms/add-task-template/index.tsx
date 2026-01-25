import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useGQL } from '../../hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import { useNavigate } from 'react-router-dom';
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
import { CreateTemplateInput, PresetTemplateStatusEnum } from 'views/preset-template/constants/types';
import { base64ToBlob } from 'utils/base64ToBlob';
import blobUploadHelper from 'utils/blogUploader';
import { PATH_FOR_TASK_TEMPLATE } from 'constants/S3ImagePaths';
import { ImageCropperModalCustomized } from 'components/modal/customizedCropperModal';
import CustomLoader from 'components/loader';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import DeleteIcon from '@mui/icons-material/Delete';
import { convertTimestampToFloat } from 'utils/time-formatter';

// Define interface for image upload field props
interface ImageUploadFieldProps {
    index: number;
    croppedImage: { base64: string; imageType: string } | null | undefined;
    imageKey: string | undefined;
    handleSelectProfileImage: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    handleRemoveImage: (index: number) => void;
    loading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

// Memoized Image Upload Component
const ImageUploadField = React.memo<ImageUploadFieldProps>(
    ({ index, croppedImage, imageKey, handleSelectProfileImage, handleRemoveImage, loading, fileInputRef }) => {
        const handleClick = () => {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
                fileInputRef.current.click();
            }
        };

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
                        backgroundImage: croppedImage?.base64 ? `url(${croppedImage.base64})` : imageKey ? `url(${imageKey})` : 'none',
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
};

// Define props type
interface StepComponentProps {
    index: number;
    step: Step;
    croppedImage: { base64: string; imageType: string } | null;
    imageKey: string;
    handleSelectProfileImage: (event: React.ChangeEvent<HTMLInputElement>, index: number) => Promise<void>;
    handleRemoveImage: (index: number) => void;
    loading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    setFieldValue: (field: string, value: any) => void;
    remove: () => void;
    showRemove: boolean;
}

// New memoized StepComponent
const StepComponent = React.memo(
    ({
        index,
        step,
        croppedImage,
        imageKey,
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

        // Debounce step name updates
        useEffect(() => {
            const timeout = setTimeout(() => {
                setFieldValue(`taskStep[${index}].stepName`, localStepName);
            }, 150);
            return () => clearTimeout(timeout);
        }, [localStepName, index, setFieldValue]);

        // Immediate timer updates
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
        // Custom comparison function
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

const AddTaskTemplateComponent = () => {
    const navigate = useNavigate();
    const formRef = useRef<any>();
    const { handleOpenSnackbar } = useSnackbar();
    const { data: categories } = useSelector((state: RootState) => state.category);

    // State management
    const [openCropper, setOpenCropper] = useState(false);
    const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
    const [croppedImages, setCroppedImages] = useState<Record<string, { base64: string; imageType: string }>>({});

    const [tempImage, setTempImage] = useState<{ base64: string; imageType: string } | null>(null);
    const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
    const fileInputRefs = useRef<Record<number, React.RefObject<HTMLInputElement>>>({});

    // GraphQL hooks
    const { IMAGE_UPLOAD, CREATE_TEMPLATE } = useGQL();
    const [handleImageUpload] = IMAGE_UPLOAD();
    const [handleCreateTaskTemplate, { data, loading }] = CREATE_TEMPLATE();

    // Memoized data
    const breadcrumbLinks = useMemo(
        () => [{ title: 'Task template management', to: PresetTemplateListRoute }, { title: 'Add new task template' }],
        []
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
        if (data?.createTask) {
            handleOpenSnackbar({ message: `${data?.createTask?.message!}. Redirecting...`, alertType: 'success' });
            navigate(PresetTemplateListRoute);
        }
    }, [data, handleOpenSnackbar, navigate]);

    // Handlers
    const handleFormSubmit = useCallback(
        async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
            try {
                const { taskStep, ...others } = values;
                const sanitizedTaskStep =
                    taskStep?.map(({ id, imageUrl, timerInTimeStamp, ...step }) => ({
                        ...step,
                        timer: timerInTimeStamp ? convertTimestampToFloat(timerInTimeStamp) : null,
                        timerInTimeStamp: timerInTimeStamp ? timerInTimeStamp : null
                    })) || [];

                setSubmitting(true);
                await handleCreateTaskTemplate({
                    variables: {
                        input: {
                            ...others,
                            taskStep: sanitizedTaskStep,
                            status: PresetTemplateStatusEnum.Active
                        }
                    }
                });
                setSubmitting(false);
            } catch (err) {
                handleOpenSnackbar({ message: 'Failed to create task template', alertType: 'error' });
                setSubmitting(false);
            }
        },
        [handleCreateTaskTemplate, handleOpenSnackbar]
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
    const handleRemoveImage = useCallback((index: number) => {
        setLoadingImages((prev) => ({ ...prev, [index]: true }));

        if (fileInputRefs.current[index]?.current) {
            fileInputRefs.current[index].current!.value = '';
        }

        setCroppedImages((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });

        delete fileInputRefs.current[index];

        setLoadingImages((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });
    }, []);

    // New function to handle index adjustment after removal
    const adjustIndicesAfterRemoval = (removedIndex: number) => {
        // Adjust croppedImages
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

        // Adjust fileInputRefs
        const newRefs = {};
        Object.entries(fileInputRefs.current)
            .map(([key, value]) => ({ index: Number(key), value }))
            .filter(({ index }) => index !== removedIndex)
            .forEach(({ index, value }) => {
                newRefs[index > removedIndex ? index - 1 : index] = value;
            });
        fileInputRefs.current = newRefs;

        // Adjust loadingImages
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

    // Function to get or create a ref for an index
    const getFileInputRef = useCallback((index: number) => {
        if (!fileInputRefs.current[index]) {
            fileInputRefs.current[index] = React.createRef<HTMLInputElement>();
        }
        return fileInputRefs.current[index];
    }, []);

    // Memoized form render
    const renderForm = useCallback(
        ({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => {
            return (
                <form onSubmit={handleSubmit}>
                    <MainCard
                        title={
                            <Grid container justifyContent={{ md: 'space-between' }} alignItems={{ md: 'center' }} spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <Typography variant="h2">Add new task template</Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Stack>
                                        <Button disabled={isSubmitting} variant="contained" type="submit">
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
                                            handleSelectProfileImage={handleSelectProfileImage}
                                            handleRemoveImage={(idx) => {
                                                handleRemoveImage(idx);
                                            }}
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
        [
            croppedImages,
            getFileInputRef,
            handleRemoveImage,
            handleSelectProfileImage,
            loadingImages,
            openCropper,
            selectedStepIndex,
            taskCategories,
            tempImage
        ]
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
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            handleSaveIncludingImage(values, setSubmitting);
                        }}
                    >
                        {renderForm}
                    </Formik>

                    {/* Image Cropper Modal - Add this block */}
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

export default AddTaskTemplateComponent;
