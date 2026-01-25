import Chip from 'ui-component/extended/Chip';
import useSnackbar from "hooks/common/useSnackbar";
import { useCopyToClipboard } from "hooks/useCopyToClipboard";


export const ChipCopyText = (renderChip: { label: string; value: string }, index: number) => {
    const { handleOpenSnackbar } = useSnackbar();
    
    const handleChipClick = async (value: string) => {
        try {
            await useCopyToClipboard(`{{${value}}}`);
            handleOpenSnackbar({ message: 'Text copied!', alertType: 'success', timeout: 1000 });
        }catch(e) {}
    };
    
    return (
        <Chip
        key={index}
        label={renderChip.label}
        size="medium"
        chipcolor="primary"
        onClick={() => handleChipClick(renderChip.value)}
        />
    );
};

