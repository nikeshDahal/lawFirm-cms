import { Box, Stack, styled } from "@mui/material";

export const StickyHeader = styled(Stack)({
    position: 'sticky',
    top: 0,
    backgroundColor: 'inherit',
    paddingTop: '20px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1
});

export const StickyFooter = styled(Stack)({
    marginTop: 16,
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'inherit',
    padding: '10px 0 20px',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16
});

export const ModalBox = styled(Box)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 620,
    minWidth: 280,
    padding: '0 20px',
    borderRadius: '8px',
    maxHeight: '90%',
    overflowY: 'auto',
});