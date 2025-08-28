document.addEventListener('DOMContentLoaded', function () {
    // Lógica do site principal (abas, gráfico, navegação)
    const tabs = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            tabPanes.forEach(pane => {
                pane.classList.toggle('hidden', pane.id !== target);
                pane.classList.toggle('active', pane.id === target);
            });
        });
    });

    const ctx = document.getElementById('impactChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', data: { labels: ['Engajamento', 'Comunicação', 'Desempenho'], datasets: [{ label: 'Aumento Potencial (%)', data: [50, 30, 62], backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(255, 127, 80, 0.7)', 'rgba(234, 179, 8, 0.7)'], borderColor: ['rgba(59, 130, 246, 1)', 'rgba(255, 127, 80, 1)', 'rgba(234, 179, 8, 1)'], borderWidth: 1 }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: value => value + '%' } } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => `${context.dataset.label || ''}: ${context.parsed.y}%` } } } }
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    const mobileNav = document.getElementById('mobile-nav');

    function changeActiveLink() {
        let index = sections.length;
        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
        navLinks.forEach((link) => link.classList.remove('active'));
        if (index >= 0 && index < navLinks.length) navLinks[index].classList.add('active');
    }

    changeActiveLink();
    window.addEventListener('scroll', changeActiveLink);

    mobileNav.addEventListener('change', (e) => {
        const targetElement = document.querySelector(e.target.value);
        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
    });

    // Lógica do Protótipo Interativo
    const sessionData = {
        formas: {
            title: 'Sessão de Formas',
            questions: [
                { prompt: 'Qual é o círculo?', options: [{type: 'shape', value: '●'}, {type: 'shape', value: '■'}, {type: 'shape', value: '▲'}], correct: 0 },
                { prompt: 'Qual é o quadrado?', options: [{type: 'shape', value: '▲'}, {type: 'shape', value: '●'}, {type: 'shape', value: '■'}], correct: 2 },
                { prompt: 'Qual é o triângulo?', options: [{type: 'shape', value: '■'}, {type: 'shape', value: '▲'}, {type: 'shape', value: '●'}], correct: 1 },
                { prompt: 'Qual NÃO é um círculo?', options: [{type: 'shape', value: '●'}, {type: 'shape', value: '●'}, {type: 'shape', value: '■'}], correct: 2 },
                { prompt: 'Encontre o quadrado.', options: [{type: 'shape', value: '▲'}, {type: 'shape', value: '■'}, {type: 'shape', value: '▲'}], correct: 1 }
            ]
        },
        cores: {
            title: 'Sessão de Cores',
            questions: [
                { prompt: 'Qual é o vermelho?', options: [{type: 'color', value: 'bg-red-500'}, {type: 'color', value: 'bg-blue-500'}, {type: 'color', value: 'bg-green-500'}], correct: 0 },
                { prompt: 'Qual é o azul?', options: [{type: 'color', value: 'bg-yellow-400'}, {type: 'color', value: 'bg-blue-500'}, {type: 'color', value: 'bg-red-500'}], correct: 1 },
                { prompt: 'Qual é o verde?', options: [{type: 'color', value: 'bg-green-500'}, {type: 'color', value: 'bg-yellow-400'}, {type: 'color', value: 'bg-blue-500'}], correct: 0 },
                { prompt: 'Qual é o amarelo?', options: [{type: 'color', value: 'bg-red-500'}, {type: 'color', value: 'bg-green-500'}, {type: 'color', value: 'bg-yellow-400'}], correct: 2 },
                { prompt: 'Qual cor NÃO é azul?', options: [{type: 'color', value: 'bg-blue-500'}, {type: 'color', value: 'bg-red-500'}, {type: 'color', value: 'bg-blue-500'}], correct: 1 }
            ]
        },
        numeros: {
            title: 'Sessão de Números',
            questions: [
                { prompt: 'Qual é o número 2?', options: [{type: 'number', value: '1'}, {type: 'number', value: '2'}, {type: 'number', value: '3'}], correct: 1 },
                { prompt: 'Qual é o número 5?', options: [{type: 'number', value: '5'}, {type: 'number', value: '3'}, {type: 'number', value: '4'}], correct: 0 },
                { prompt: 'Qual é o número 3?', options: [{type: 'number', value: '1'}, {type: 'number', value: '2'}, {type: 'number', value: '3'}], correct: 2 },
                { prompt: 'Qual número vem depois do 1?', options: [{type: 'number', value: '3'}, {type: 'number', value: '1'}, {type: 'number', value: '2'}], correct: 2 },
                { prompt: 'Quantos círculos você vê?', options: [{type: 'number', value: '1'}, {type: 'number', value: '3'}, {type: 'number', value: '2'}], prompt_extra: '● ●', correct: 2 }
            ]
        }
    };

    const sessionSelectionScreen = document.getElementById('session-selection-screen');
    const sessionActiveScreen = document.getElementById('session-active-screen');
    const resultsScreen = document.getElementById('results-screen');
    const sessionTitle = document.getElementById('session-title');
    const timerDisplay = document.getElementById('timer');
    const promptDisplay = document.getElementById('prompt');
    const optionsContainer = document.getElementById('options-container');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const resultsText = document.getElementById('results-text');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const feedbackContent = document.getElementById('feedback-content');

    let currentSession, currentQuestionIndex, score, timerInterval, timeLeft;

    document.querySelectorAll('.session-btn').forEach(button => {
        button.addEventListener('click', () => {
            const sessionType = button.getAttribute('data-session-type');
            startSession(sessionType);
        });
    });

    backToMenuBtn.addEventListener('click', () => {
        resultsScreen.classList.add('hidden');
        sessionSelectionScreen.classList.remove('hidden');
    });

    function startSession(sessionType) {
        currentSession = sessionData[sessionType];
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 600; // 10 minutes in seconds

        sessionSelectionScreen.classList.add('hidden');
        sessionActiveScreen.classList.remove('hidden');
        
        sessionTitle.textContent = currentSession.title;
        updateTimerDisplay();
        timerInterval = setInterval(updateTimer, 1000);
        
        renderQuestion();
    }

    function renderQuestion() {
        const question = currentSession.questions[currentQuestionIndex];
        promptDisplay.innerHTML = question.prompt + (question.prompt_extra ? `<div class="text-6xl mt-2">${question.prompt_extra}</div>` : '');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-card cursor-pointer p-4 rounded-lg flex items-center justify-center';
            
            if (option.type === 'shape' || option.type === 'number') {
                optionElement.textContent = option.value;
                optionElement.className += ' bg-gray-200 text-6xl font-bold text-gray-800';
            } else if (option.type === 'color') {
                optionElement.className += ` ${option.value} h-32 w-full`;
            }
            
            optionElement.addEventListener('click', () => handleAnswer(index));
            optionsContainer.appendChild(optionElement);
        });

        progressText.textContent = `Progresso: ${currentQuestionIndex} de ${currentSession.questions.length}`;
        progressBar.style.width = `${(currentQuestionIndex / currentSession.questions.length) * 100}%`;
    }

    function handleAnswer(selectedIndex) {
        const question = currentSession.questions[currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        showFeedback(isCorrect);

        if (isCorrect) {
            score++;
        }

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < currentSession.questions.length) {
                renderQuestion();
            } else {
                endSession();
            }
        }, 1500);
    }

    function showFeedback(isCorrect) {
        feedbackContent.textContent = isCorrect ? 'Correto! 👍' : 'Tente de novo.';
        feedbackContent.className = 'text-white text-4xl font-bold p-8 rounded-full';
        feedbackContent.classList.add(isCorrect ? 'bg-green-500' : 'bg-red-500');
        
        feedbackModal.classList.remove('opacity-0', 'pointer-events-none');
        
        setTimeout(() => {
            feedbackModal.classList.add('opacity-0', 'pointer-events-none');
        }, 1200);
    }

    function updateTimer() {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            endSession();
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function endSession() {
        clearInterval(timerInterval);
        sessionActiveScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        resultsText.textContent = `Você acertou ${score} de ${currentSession.questions.length} perguntas!`;
    }
});
