// frontend/src/js/feedback.js

/**
 * Send feedback to the API
 * @param {string} feedback - The feedback text to send
 * @returns {Promise<Object>} Response from the API
 */
async function sendFeedbackToAPI(feedback) {
    try {
        const response = await fetch('http://localhost:3000/api/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ feedback })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit feedback');
        }

        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Validate feedback content
 * @param {string} feedback - The feedback text to validate
 * @returns {boolean} Whether the feedback is valid
 */
function validateFeedback(feedback) {
    return feedback && 
           typeof feedback === 'string' && 
           feedback.length >= 1 && 
           feedback.length <= 1000;
}

/**
 * Initialize feedback functionality
 */
export function initializeFeedback() {
    const feedbackBtn = document.getElementById('feedback-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeModal = document.querySelector('.close-modal');
    const sendFeedbackBtn = document.getElementById('send-feedback-btn');
    const feedbackText = document.getElementById('feedback-text');
    
    let isSubmitting = false;
    
    function showLoadingState() {
        sendFeedbackBtn.disabled = true;
        sendFeedbackBtn.textContent = 'Sending...';
        feedbackText.disabled = true;
    }
    
    function hideLoadingState() {
        sendFeedbackBtn.disabled = false;
        sendFeedbackBtn.textContent = 'Send Feedback';
        feedbackText.disabled = false;
    }
    
    function closeModalAndReset() {
        feedbackModal.style.display = 'none';
        feedbackText.value = '';
        hideLoadingState();
        isSubmitting = false;
    }

    // Event Listeners
    feedbackBtn?.addEventListener('click', () => {
        feedbackModal.style.display = 'block';
    });

    closeModal?.addEventListener('click', closeModalAndReset);

    window.addEventListener('click', (e) => {
        if (e.target === feedbackModal) {
            closeModalAndReset();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && feedbackModal.style.display === 'block') {
            closeModalAndReset();
        }
    });

    feedbackText?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendFeedbackBtn.click();
        }
    });

    sendFeedbackBtn?.addEventListener('click', async () => {
        const feedback = feedbackText.value.trim();
        
        if (!validateFeedback(feedback)) {
            alert('Please enter valid feedback (1-1000 characters)');
            return;
        }

        if (isSubmitting) return;
        
        try {
            isSubmitting = true;
            showLoadingState();
            
            const result = await sendFeedbackToAPI(feedback);
            
            if (result.success) {
                alert('Thank you for your feedback!');
                closeModalAndReset();
            } else {
                throw new Error(result.error || 'Failed to send feedback');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to send feedback. Please try again later.');
        } finally {
            isSubmitting = false;
            hideLoadingState();
        }
    });
}

export { sendFeedbackToAPI, validateFeedback };