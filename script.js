
// Call backend proxy for OpenAI responses
async function fetchAIAssistant(userMessage) {
    const isLocal = window.location.hostname.includes('localhost');
    const apiBase = isLocal ? 'http://localhost:5000' : '';
    const endpoint = isLocal ? `${apiBase}/chat` : '/api/chat';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.response || 'Sorry, I could not get a response.';
    } catch (err) {
        console.error(err);
        return 'Sorry, I could not reach the AI service. Please ensure the backend is running.';
    }
}

// Navigation functionality
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetSection = btn.getAttribute('data-section');
        navigateTo(targetSection);
    });
});

function navigateTo(sectionName) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav buttons
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Activate corresponding nav button
    const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Utility function to format currency in Indian Rupees
function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Utility function to show result
function showResult(resultId, content, isError = false) {
    const resultDiv = document.getElementById(resultId);
    resultDiv.innerHTML = content;
    resultDiv.classList.add('show');
    resultDiv.classList.toggle('error', isError);
    resultDiv.classList.toggle('success', !isError);
}

// INVESTOR SECTION CALCULATORS

// ROI Calculator
function calculateROI() {
    const initial = parseFloat(document.getElementById('investorInitial').value);
    const final = parseFloat(document.getElementById('investorFinal').value);
    const period = parseFloat(document.getElementById('investorPeriod').value);

    // Validation
    if (isNaN(initial) || isNaN(final) || isNaN(period) || initial <= 0 || period <= 0) {
        showResult('roiResult', '<div class="result-item"><label>Error: Please enter valid values</label></div>', true);
        return;
    }

    const gain = final - initial;
    const roiPercent = (gain / initial) * 100;
    const annualROI = (roiPercent / period);

    const content = `
        <div class="result-item"><label>Initial Investment:</label> <span class="value">${formatCurrency(initial)}</span></div>
        <div class="result-item"><label>Final Value:</label> <span class="value">${formatCurrency(final)}</span></div>
        <div class="result-item"><label>Total Gain:</label> <span class="value">${formatCurrency(gain)}</span></div>
        <div class="result-item"><label>Total ROI:</label> <span class="value">${roiPercent.toFixed(2)}%</span></div>
        <div class="result-item"><label>Annual ROI:</label> <span class="value">${annualROI.toFixed(2)}%</span></div>
    `;
    showResult('roiResult', content);
}

// Investment Growth Calculator
function calculateInvestmentGrowth() {
    const principal = parseFloat(document.getElementById('growthPrincipal').value);
    const rate = parseFloat(document.getElementById('growthRate').value);
    const years = parseFloat(document.getElementById('growthYears').value);

    // Validation
    if (isNaN(principal) || isNaN(rate) || isNaN(years) || principal <= 0 || rate < 0 || years <= 0) {
        showResult('growthResult', '<div class="result-item"><label>Error: Please enter valid values</label></div>', true);
        return;
    }

    // Compound growth formula: A = P(1 + r)^t
    const finalAmount = principal * Math.pow(1 + (rate / 100), years);
    const totalGain = finalAmount - principal;

    const content = `
        <div class="result-item"><label>Initial Investment:</label> <span class="value">${formatCurrency(principal)}</span></div>
        <div class="result-item"><label>Annual Return Rate:</label> <span class="value">${rate.toFixed(2)}%</span></div>
        <div class="result-item"><label>Time Period:</label> <span class="value">${years.toFixed(1)} years</span></div>
        <div class="result-item"><label>Final Amount:</label> <span class="value">${formatCurrency(finalAmount)}</span></div>
        <div class="result-item"><label>Total Gain:</label> <span class="value">${formatCurrency(totalGain)}</span></div>
    `;
    showResult('growthResult', content);
}

// SAVINGS SECTION CALCULATORS

// Savings Goal Calculator
function calculateSavingsGoal() {
    const goal = parseFloat(document.getElementById('savingsGoal').value);
    const current = parseFloat(document.getElementById('savingsCurrent').value);
    const months = parseFloat(document.getElementById('savingsTime').value);

    // Validation
    if (isNaN(goal) || isNaN(current) || isNaN(months) || goal <= 0 || months <= 0 || current < 0) {
        showResult('savingsResult', '<div class="result-item"><label>Error: Please enter valid values</label></div>', true);
        return;
    }

    const amountNeeded = goal - current;
    const isAchievable = amountNeeded >= 0;
    const monthlySavings = isAchievable ? amountNeeded / months : 0;

    const status = isAchievable ? `You need to save ${formatCurrency(monthlySavings)} per month` : 'You have already exceeded your goal!';

    const content = `
        <div class="result-item"><label>Savings Goal:</label> <span class="value">${formatCurrency(goal)}</span></div>
        <div class="result-item"><label>Current Savings:</label> <span class="value">${formatCurrency(current)}</span></div>
        <div class="result-item"><label>Amount Needed:</label> <span class="value">${formatCurrency(Math.abs(amountNeeded))}</span></div>
        <div class="result-item"><label>Time Frame:</label> <span class="value">${months} months</span></div>
        <div class="result-item"><label>Monthly Savings Required:</label> <span class="value">${formatCurrency(Math.abs(monthlySavings))}</span></div>
        <div class="result-item"><label>Status:</label> <span class="value" style="color: #667eea;">${status}</span></div>
    `;
    showResult('savingsResult', content);
}

// Savings with Interest Calculator
function calculateSavingsWithInterest() {
    const monthly = parseFloat(document.getElementById('monthlyAmount').value);
    const rate = parseFloat(document.getElementById('savingsInterestRate').value);
    const months = parseFloat(document.getElementById('savingsDuration').value);

    // Validation
    if (isNaN(monthly) || isNaN(rate) || isNaN(months) || monthly <= 0 || rate < 0 || months <= 0) {
        showResult('savingsInterestResult', '<div class="result-item"><label>Error: Please enter valid values</label></div>', true);
        return;
    }

    // Future Value of Annuity formula: FV = PMT * (((1 + r)^n - 1) / r)
    const monthlyRate = rate / 100 / 12;
    let totalAmount;

    if (monthlyRate === 0) {
        totalAmount = monthly * months;
    } else {
        totalAmount = monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    }

    const totalDeposited = monthly * months;
    const interestEarned = totalAmount - totalDeposited;

    const content = `
        <div class="result-item"><label>Monthly Savings:</label> <span class="value">${formatCurrency(monthly)}</span></div>
        <div class="result-item"><label>Annual Interest Rate:</label> <span class="value">${rate.toFixed(2)}%</span></div>
        <div class="result-item"><label>Duration:</label> <span class="value">${months} months</span></div>
        <div class="result-item"><label>Total Amount Deposited:</label> <span class="value">${formatCurrency(totalDeposited)}</span></div>
        <div class="result-item"><label>Interest Earned:</label> <span class="value">${formatCurrency(interestEarned)}</span></div>
        <div class="result-item"><label>Total Amount:</label> <span class="value" style="color: #28a745;">${formatCurrency(totalAmount)}</span></div>
    `;
    showResult('savingsInterestResult', content);
}

// INTEREST SECTION CALCULATORS

// Simple Interest Calculator
function calculateSimpleInterest() {
    const principal = parseFloat(document.getElementById('simplePrincipal').value);
    const rate = parseFloat(document.getElementById('simpleRate').value);
    const time = parseFloat(document.getElementById('simpleTime').value);

    // Validation
    if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate < 0 || time <= 0) {
        showResult('simpleResult', '<div class="result-item"><label>Error: Please enter valid values</label></div>', true);
        return;
    }

    // Simple Interest formula: SI = (P * R * T) / 100
    const interest = (principal * rate * time) / 100;
    const finalAmount = principal + interest;

    const content = `
        <div class="result-item"><label>Principal Amount:</label> <span class="value">${formatCurrency(principal)}</span></div>
        <div class="result-item"><label>Rate of Interest:</label> <span class="value">${rate.toFixed(2)}% per annum</span></div>
        <div class="result-item"><label>Time Period:</label> <span class="value">${time.toFixed(1)} years</span></div>
        <div class="result-item"><label>Simple Interest:</label> <span class="value">${formatCurrency(interest)}</span></div>
        <div class="result-item"><label>Total Amount:</label> <span class="value" style="color: #28a745;">${formatCurrency(finalAmount)}</span></div>
    `;
    showResult('simpleResult', content);
}

// Compound Interest Calculator
function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('compoundPrincipal').value);
    const rate = parseFloat(document.getElementById('compoundRate').value);
    const time = parseFloat(document.getElementById('compoundTime').value);
    const frequency = parseFloat(document.getElementById('compoundFreq').value);

    // Validation
    if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate < 0 || time <= 0) {
        showResult('compoundResult', '<div class="result-item"><label>Error: Please enter valid values</label></div>', true);
        return;
    }

    // Compound Interest formula: A = P(1 + r/n)^(nt)
    const finalAmount = principal * Math.pow(1 + (rate / 100 / frequency), frequency * time);
    const interest = finalAmount - principal;

    const frequencyLabel = {
        1: 'Annually',
        2: 'Semi-Annually',
        4: 'Quarterly',
        12: 'Monthly',
        365: 'Daily'
    }[frequency] || 'Unknown';

    const content = `
        <div class="result-item"><label>Principal Amount:</label> <span class="value">${formatCurrency(principal)}</span></div>
        <div class="result-item"><label>Rate of Interest:</label> <span class="value">${rate.toFixed(2)}% per annum</span></div>
        <div class="result-item"><label>Time Period:</label> <span class="value">${time.toFixed(1)} years</span></div>
        <div class="result-item"><label>Compounding Frequency:</label> <span class="value">${frequencyLabel}</span></div>
        <div class="result-item"><label>Compound Interest:</label> <span class="value">${formatCurrency(interest)}</span></div>
        <div class="result-item"><label>Total Amount:</label> <span class="value" style="color: #28a745;">${formatCurrency(finalAmount)}</span></div>
    `;
    showResult('compoundResult', content);
}


// AI Financial Advisor Functionality

// Global variables for AI advisor
let currentStep = 1;
let userData = {};
let chatMessages = [];

// Start questionnaire
function startQuestionnaire() {
    document.getElementById('questionnaire').style.display = 'block';
    addMessage('ai', 'Great! Let\'s gather some information about your financial situation. I\'ll ask you a few questions to create a personalized saving plan.');
    scrollToBottom();
}

// Navigation between questionnaire steps
function nextStep(step) {
    if (validateCurrentStep()) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep = step;
        document.getElementById(`step${currentStep}`).classList.add('active');
    }
}

function prevStep(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
}

// Validate current step
function validateCurrentStep() {
    const stepElement = document.getElementById(`step${currentStep}`);
    const inputs = stepElement.querySelectorAll('input, select');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });

    
    if (!isValid) {
        addMessage('ai', 'Please complete all required fields before continuing.');
        scrollToBottom();
    }
return isValid;
}

// Handle form submission
document.getElementById('financialForm').addEventListener('submit', function(e) {
    try {
    e.preventDefault();

    // Collect all form data
    const formData = new FormData(this);
    userData = {
        monthlyIncome: parseFloat(formData.get('monthlyIncome')) || 0,
        monthlyExpenses: parseFloat(formData.get('monthlyExpenses')) || 0,
        currentSavings: parseFloat(formData.get('currentSavings')) || 0,
        savingGoal: parseFloat(formData.get('savingGoal')) || 0,
        timeFrame: parseFloat(formData.get('timeFrame')) || 0,
        riskTolerance: formData.get('riskTolerance') || 'medium',
        debtPayments: parseFloat(formData.get('debtPayments')) || 0,
        emergencyFund: parseFloat(formData.get('emergencyFund')) || 0,
        investmentExp: formData.get('investmentExp') || 'beginner'
    };

    // Generate personalized plan
    generatePersonalizedPlan();

    } catch (err) {
        console.error(err);
        addMessage('ai', 'Sorry, something went wrong while generating your plan. Please make sure all fields are filled correctly.');
    }
});

// Generate personalized financial plan
function generatePersonalizedPlan() {
    addMessage('ai', 'Creating your personalized plan...');
    scrollToBottom();

    const analysis = analyzeFinancialData(userData);

    // Hide questionnaire and show results
    document.getElementById('questionnaire').style.display = 'none';

    // Display results in chat
    addMessage('ai', `Based on your information, here's your personalized financial analysis and saving plan:`);

    // Create results container
    const resultsHTML = `
        <div class="ai-results">
            <div class="result-card">
                <h5>💰 Your Financial Overview</h5>
                <p><strong>Monthly Surplus:</strong> ${formatCurrency(analysis.monthlySurplus)}</p>
                <p><strong>Saving Potential:</strong> ${analysis.savingPotential}% of income</p>
                <p><strong>Goal Feasibility:</strong> ${analysis.goalFeasibility}</p>
            </div>

            <div class="result-card">
                <h5>🎯 Your Saving Plan</h5>
                <p><strong>Monthly Savings Needed:</strong> ${formatCurrency(analysis.monthlySavingsNeeded)}</p>
                <p><strong>Recommended Investment:</strong> ${analysis.investmentRecommendation}</p>
                <p><strong>Risk Strategy:</strong> ${analysis.riskStrategy}</p>
            </div>

            <div class="result-card">
                <h5>📋 Action Items</h5>
                ${analysis.actionItems.map(item => `<p>• ${item}</p>`).join('')}
            </div>

            <div class="result-card">
                <h5>💡 Personalized Tips</h5>
                ${analysis.personalizedTips.map(tip => `<p>• ${tip}</p>`).join('')}
            </div>
        </div>
    `;

    
    const planDiv = document.getElementById('planOutput');
    if (planDiv) {
        planDiv.style.display = 'block';
        planDiv.innerHTML = resultsHTML;
    }
// Add results to chat
    setTimeout(() => {
        addMessage('ai', resultsHTML);
        addMessage('ai', 'Would you like me to explain any part of this plan in more detail, or help you with specific calculations?');

        // Save plan for later review
        const planToSave = {
            timestamp: new Date().toLocaleString(),
            monthlyIncome: userData.monthlyIncome,
            monthlyExpenses: userData.monthlyExpenses,
            monthlySurplus: analysis.monthlySurplus,
            savingGoal: userData.savingGoal,
            timeFrame: userData.timeFrame,
            goalFeasibility: analysis.goalFeasibility
        };
        savePlan(planToSave);
    }, 1000);
}

// Analyze financial data and generate recommendations
function analyzeFinancialData(data) {
    // Include insurance coverage in evaluation
    data.lifeInsurance = parseFloat(document.getElementById('lifeInsurance').value) || 0;
    data.healthInsurance = parseFloat(document.getElementById('healthInsurance').value) || 0;
    const analysis = {};

    // Calculate monthly surplus
    analysis.monthlySurplus = data.monthlyIncome - data.monthlyExpenses - data.debtPayments;

    // Calculate saving potential
    analysis.savingPotential = data.monthlyIncome > 0 ?
        Math.round((analysis.monthlySurplus / data.monthlyIncome) * 100) : 0;

    // Calculate goal feasibility
    const totalNeeded = data.savingGoal - data.currentSavings;
    const monthlyNeeded = totalNeeded / data.timeFrame;
    analysis.monthlySavingsNeeded = monthlyNeeded;

    if (monthlyNeeded <= analysis.monthlySurplus) {
        analysis.goalFeasibility = 'Achievable - You can reach your goal!';
    } else if (monthlyNeeded <= analysis.monthlySurplus * 1.5) {
        analysis.goalFeasibility = 'Challenging but possible with adjustments';
    } else {
        analysis.goalFeasibility = 'May need to extend timeline or increase income';
    }

    // Investment recommendations based on risk tolerance and experience
    if (data.riskTolerance === 'low' && data.investmentExp === 'beginner') {
        analysis.investmentRecommendation = 'FDs, PPF, or Conservative Mutual Funds (6-8% returns)';
        analysis.riskStrategy = 'Conservative - Focus on capital preservation';
    } else if (data.riskTolerance === 'medium' || data.investmentExp === 'intermediate') {
        analysis.investmentRecommendation = 'Balanced Mutual Funds, Index Funds (10-12% returns)';
        analysis.riskStrategy = 'Balanced - Mix of growth and safety';
    } else {
        analysis.investmentRecommendation = 'Equity Savings, Aggressive Funds (12-15% returns)';
        analysis.riskStrategy = 'Aggressive - Higher risk for higher returns';
    }

    // Generate action items
    analysis.actionItems = [];
    if (analysis.monthlySurplus < 0) {
        analysis.actionItems.push('Reduce monthly expenses by tracking and cutting non-essential spending');
        analysis.actionItems.push('Consider side income or career advancement to increase earnings');
    } else {
        analysis.actionItems.push(`Save at least ${formatCurrency(analysis.monthlySurplus * 0.7)} monthly`);
        analysis.actionItems.push('Build emergency fund of 6 months expenses');
    }

    if (data.debtPayments > data.monthlyIncome * 0.3) {
        analysis.actionItems.push('Focus on debt reduction - consider debt consolidation');
    }

    analysis.actionItems.push(`Review and adjust your ${data.riskTolerance} risk investment strategy annually`);

    // Personalized tips
    analysis.personalizedTips = [];

    if (data.monthlyIncome < 30000) {
        analysis.personalizedTips.push('Consider upskilling or additional income sources');
        analysis.personalizedTips.push('Use government schemes like Sukanya Samriddhi for long-term goals');
    } else if (data.monthlyIncome < 100000) {
        analysis.personalizedTips.push('Maximize tax-saving investments (ELSS, PPF)');
        analysis.personalizedTips.push('Consider SIP investments for wealth creation');
    } else {
        analysis.personalizedTips.push('Diversify investments across asset classes');
        analysis.personalizedTips.push('Consider tax-efficient investment structures');
    }

    if (data.emergencyFund < 3) {
        analysis.personalizedTips.push('Prioritize building 3-6 months emergency fund');
    }

    analysis.personalizedTips.push('Track expenses monthly and review financial goals quarterly');

    return analysis;
}

// Chat functionality
function addMessage(sender, content) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${sender === 'ai' ? 'fa-robot' : 'fa-user'}"></i>
        </div>
        <div class="message-content">
            ${content}
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Chat input functionality (for future expansion)
document.getElementById('chatInput').addEventListener('keypress', async function(e) {
    if (e.key === 'Enter') {
        const message = this.value.trim();
        if (message) {
            addMessage('user', message);
            this.value = '';

            // Fetch AI response from backend
            const response = await getAIResponse(message.toLowerCase());
            addMessage('ai', formatAgentResponse(response));
        }
    }
});

function getAIResponse(message) {
    // If the backend proxy is available, use it for better answers
    return fetchAIAssistant(message);
} else if (message.includes('saving') || message.includes('save')) {
        return 'For saving plans, please fill out our financial assessment questionnaire. It will give you personalized recommendations!';
    } else if (message.includes('interest') || message.includes('compound')) {
        return 'Check out our Interest Calculator section for simple and compound interest calculations.';
    } else if (message.includes('investment') || message.includes('invest')) {
        return 'Our Investor Tools section has ROI calculators and investment growth projections.';
    } else {
        return 'I\'m here to help with your financial planning! Try our calculators or fill out the assessment for personalized advice.';
    }
}


// Fullscreen mode toggle
function toggleFullScreen() {
    const main = document.querySelector('.main-content');
    main.classList.toggle('fullscreen-mode');
    const btn = document.getElementById('fullScreenBtn');
    btn.textContent = main.classList.contains('fullscreen-mode') ? 'Exit Full' : 'Full Screen';
}

// Persist and load saved plans using localStorage
function savePlan(plan) {
    const savedPlans = JSON.parse(localStorage.getItem('finCalcyPlans') || '[]');
    savedPlans.unshift(plan);
    localStorage.setItem('finCalcyPlans', JSON.stringify(savedPlans.slice(0, 10)));
    renderSavedPlans();
}

function loadSavedPlans() {
    const savedPlans = JSON.parse(localStorage.getItem('finCalcyPlans') || '[]');
    return savedPlans;
}

function clearSavedPlans() {
    localStorage.removeItem('finCalcyPlans');
    renderSavedPlans();
}

function renderSavedPlans() {
    const list = document.getElementById('savedPlansList');
    const savedPlans = loadSavedPlans();
    const container = document.getElementById('savedPlans');

    if (!savedPlans.length) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    list.innerHTML = '';

    savedPlans.forEach((plan, idx) => {
        const item = document.createElement('div');
        item.className = 'saved-plan-item';
        item.innerHTML = `
            <h4>Plan ${idx + 1} - ${plan.timestamp}</h4>
            <p><strong>Income:</strong> ${formatCurrency(plan.monthlyIncome)}</p>
            <p><strong>Surplus:</strong> ${formatCurrency(plan.monthlySurplus)}</p>
            <p><strong>Goal:</strong> ${formatCurrency(plan.savingGoal)} in ${plan.timeFrame} months</p>
            <p><strong>Plan:</strong> ${plan.goalFeasibility}</p>
        `;
        list.appendChild(item);
    });
}

// Determine agent tone based on selection
function getAgentPersona() {
    const sel = document.getElementById('agentSelector');
    if (!sel) return 'planner';
    return sel.value;
}

function getAgentSignature() {
    const persona = getAgentPersona();
    if (persona === 'insurance') return 'Insurance Guide';
    if (persona === 'retirement') return 'Retirement Coach';
    return 'Financial Planner';
}

function formatAgentResponse(message) {
    const persona = getAgentPersona();
    if (persona === 'insurance') {
        return `🛡️ <strong>Insurance Tip:</strong> ${message}`;
    }
    if (persona === 'retirement') {
        return `🏦 <strong>Retirement Tip:</strong> ${message}`;
    }
    return message;
}

// Initialize - show dashboard on load
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('dashboard');
    renderSavedPlans();
});