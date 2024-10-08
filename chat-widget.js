// Get script element and its attributes
const scriptElement = document.currentScript;
const primaryColor = scriptElement.getAttribute('data-primary-color') || '#bb162b';
const secondaryColor = scriptElement.getAttribute('data-secondary-color') || '#d24c60';
const clientName = scriptElement.getAttribute('data-client-name') || 'Company Name';
const identifier = scriptElement.getAttribute('data-identifier') || 'defaultIdentifier';
const headerText = scriptElement.getAttribute('data-header-text') || 'How Can We Help You?';

// Inject the chat widget HTML into the page
const widgetHTML = `
  <div id="chat-bubble">💬</div>
  <div id="chat-form-container">
    <div id="chat-header">${headerText}<button id="close-chat">×</button></div>
    <div id="text-bubble">
      Enter your info below and any information regarding your vehicle choice and a representative will be right with you.
    </div>
    <form id="chat-form">
      <input type="text" id="name" name="name" placeholder="Your Name" required>
      <input type="email" id="email" name="email" placeholder="Your Email" required>
      <input type="tel" id="phone" name="phone" placeholder="Your Phone Number" required>
      <input type="hidden" id="identifier" name="identifier" value="${identifier}">
      <textarea id="message" name="message" placeholder="Your Message or Vehicle Choice" required style="height: 100px;"></textarea>
      <button type="submit">Send Message 👉🏼</button>
      <div id="form-footer">
        By submitting, you agree to receive SMS or emails. Rates may apply.
      </div>
    </form>
    <div id="confirmation-bubble" style="display:none;">
      Thanks for your enquiry. One of our authorized representatives will be in touch any minute now. 🏎️
    </div>
    <div id="powered-by">
      Powered by <a href="https://visquanta.com/speed-to-lead" target="_blank">${clientName}</a>
    </div>
  </div>
`;

// Inject the widget into the document
document.body.insertAdjacentHTML('beforeend', widgetHTML);

// Apply dynamic styles for colors
const style = document.createElement('style');
style.textContent = `
  body, input, textarea, button {
    font-family: 'Helvetica', 'Arial', sans-serif;
  }
  #chat-bubble {
    background-color: ${primaryColor};
    position: fixed;
    bottom: 20px;
    right: 20px;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
    font-size: 30px;
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  #chat-bubble:hover {
    background-color: ${secondaryColor};
    transform: scale(1.1);
  }
  #chat-form-container {
    display: none;
    position: fixed;
    bottom: 100px;
    right: 20px;
    width: 300px;
    height: 600px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    flex-direction: column;
    overflow: hidden;
  }
  #chat-header {
    background: linear-gradient(to right, ${primaryColor}, ${secondaryColor});
    color: white;
    font-size: 16px;
    padding: 17px 12px;
    border-radius: 10px 10px 0 0;
    text-align: center;
    position: relative;
  }
  #close-chat {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    cursor: pointer;
  }
  #text-bubble {
    background-color: #f2f4f7;
    padding: 15px;
    margin: 15px 20px;
    border-radius: 0 2rem 2rem 2rem;
    font-size: 14px;
    color: #111828;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  #chat-form {
    border: 2px solid;
    border-image: linear-gradient(to right, ${primaryColor}, ${secondaryColor}) 1;
    padding: 15px;
    border-radius: 8px;
    margin: 15px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-y: auto;
  }
  #chat-form input, #chat-form textarea {
    width: 100%;
    padding: 8px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 12px;
  }
  #chat-form button {
    width: 100%;
    padding: 8px;
    margin: 8px 0;
    background-color: ${primaryColor};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
  }
  #chat-form button:hover {
    background-color: ${secondaryColor};
  }
`;
document.head.appendChild(style);

// Attach functionality to the chat widget
const chatBubble = document.getElementById('chat-bubble');
const chatFormContainer = document.getElementById('chat-form-container');
const closeChat = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const textBubble = document.getElementById('text-bubble');
const confirmationBubble = document.getElementById('confirmation-bubble');
const chatHeader = document.getElementById('chat-header');

// Toggle chat form when bubble is clicked
chatBubble.addEventListener('click', () => {
  chatFormContainer.style.display = (chatFormContainer.style.display === 'flex') ? 'none' : 'flex';
});

// Close chat form when close button is clicked
closeChat.addEventListener('click', () => {
  chatFormContainer.style.display = 'none';
});

// Handle form submission
chatForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const submitButton = chatForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    message: document.getElementById('message').value.trim(),
    identifier: document.getElementById('identifier').value
  };

  fetch('https://api.visquanta.com/webhook/chat-widget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  .then(response => {
    if (!response.ok) throw new Error('Server error');
    return response.json();
  })
  .then(() => {
    chatForm.reset();
    chatForm.style.display = 'none';
    textBubble.style.display = 'none';
    confirmationBubble.style.display = 'block';
    chatHeader.textContent = 'All Done! 🏆';
  })
  .catch((error) => {
    console.error('Error:', error);
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message 👉🏼';
    confirmationBubble.style.display = 'block';
    confirmationBubble.textContent = 'There was an error submitting the form. Please try again later.';
  });
});
