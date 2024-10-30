export function showLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    if (!loadingDialog) {
        console.error('Loading dialog not found');
        return;
    }
    loadingDialog.style.display = 'flex';
}

export function hideLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    if (!loadingDialog) {
        console.error('Loading dialog not found');
        return;
    }
    loadingDialog.style.display = 'none';
}