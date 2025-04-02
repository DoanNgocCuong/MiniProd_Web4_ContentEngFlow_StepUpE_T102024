import { config } from '../config.js';

export class DetailChunkingFromQuestionButton {
    constructor(scenario, question, containerId, weekData) {
        this.scenario = scenario;
        this.question = question;
        this.containerId = containerId;
        this.weekData = weekData;
        this.isVisible = false;
        this.isExample = this._checkIfExample();
        console.log('DetailChunking initialized:', {
            scenario: this.scenario,
            weekData: this.weekData,
            isExample: this.isExample
        });
        this.button = this._createButton();
        this.sampleData = null;
    }

    _checkIfExample() {
        if (this.weekData && typeof this.weekData.topic === 'string') {
            const isWeekExample = this.weekData.topic.includes('[Example') || 
                                this.weekData.topic.includes('[範例') || 
                                this.weekData.topic.includes('[例');
            if (isWeekExample) {
                console.log('Example detected from week data:', this.weekData.topic);
                return true;
            }
        }

        if (this.scenario && typeof this.scenario === 'string') {
            const isScenarioExample = this.scenario.includes('[Example') || 
                                    this.scenario.includes('[範例') || 
                                    this.scenario.includes('[例');
            if (isScenarioExample) {
                console.log('Example detected from scenario:', this.scenario);
                return true;
            }
        }

        console.log('Not an example case');
        return false;
    }

    _createButton() {
        const button = document.createElement('button');
        button.className = 'generate-detail-chunking-btn';
        button.textContent = 'Show Details';
        button.addEventListener('click', async (e) => {
            await this._handleClick(e);
        });
        return button;
    }

    async _loadSampleData() {
        try {
            const response = await fetch('/pages/learningPath/js/data/sampleDetailChunkingFromQuestion.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Sample data loaded successfully:', data);
            return data;
        } catch (error) {
            console.error('Error loading sample data:', error);
            throw error;
        }
    }

    async _generateDetailChunking() {
        try {
            const response = await fetch(`${config.production.apiUrl}/questions/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario: this.scenario,
                    question: this.question,
                    count: 1,
                    type: 'detail'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response:', data);
            return data;
        } catch (error) {
            console.error('Error calling API:', error);
            throw error;
        }
    }

    async _handleClick(e) {
        const btn = e.target;
        const container = document.getElementById(this.containerId);

        if (!this.isVisible) {
            btn.disabled = true;
            btn.textContent = 'Loading...';

            try {
                let data;
                if (this.isExample) {
                    console.log('Using sample data for example case');
                    data = await this._loadSampleData();
                } else {
                    console.log('Using API for real data');
                    try {
                        data = await this._generateDetailChunking();
                    } catch (apiError) {
                        console.log('API call failed, falling back to sample data:', apiError);
                        data = await this._loadSampleData();
                    }
                }
                
                this._displayDetailChunking(data);
                btn.textContent = 'Hide Details';
                this.isVisible = true;
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to load details: ' + error.message);
                btn.textContent = 'Show Details';
            } finally {
                btn.disabled = false;
            }
        } else {
            container.innerHTML = '';
            btn.textContent = 'Show Details';
            this.isVisible = false;
        }
    }

    _displayDetailChunking(data) {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container not found:', this.containerId);
            return;
        }

        container.innerHTML = '';
        
        // Create main container with styling
        const mainDiv = document.createElement('div');
        mainDiv.style.cssText = `
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 20px;
            margin: 20px 0;
            font-family: Arial, sans-serif;
        `;

        // Add copy button at the top
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy JSON';
        copyButton.style.cssText = `
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 20px;
            font-size: 14px;
            transition: background-color 0.3s;
        `;
        copyButton.addEventListener('mouseover', () => {
            copyButton.style.backgroundColor = '#45a049';
        });
        copyButton.addEventListener('mouseout', () => {
            copyButton.style.backgroundColor = '#4CAF50';
        });
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            copyButton.textContent = 'Copied!';
            setTimeout(() => copyButton.textContent = 'Copy JSON', 2000);
        });
        mainDiv.appendChild(copyButton);

        const question = data.questions[0];

        // Create sections for each part
        const sections = [
            {
                title: 'Question',
                en: question.question,
                vi: question['question-vi'],
                icon: '❓'
            },
            {
                title: 'Structure',
                en: question.structure,
                vi: question['structure-vi'],
                icon: '🔨'
            },
            {
                title: 'Main Phrase',
                en: question['main phrase'],
                vi: question['main phrase-vi'],
                icon: '⭐'
            },
            {
                title: 'Optional Phrase 1',
                en: question['optional phrase 1'],
                vi: question['optional phrase 1-vi'],
                icon: '1️⃣'
            },
            {
                title: 'Optional Phrase 2',
                en: question['optional phrase 2'],
                vi: question['optional phrase 2-vi'],
                icon: '2️⃣'
            }
        ];

        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.cssText = `
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 4px solid #4CAF50;
            `;

            // Section header
            const header = document.createElement('div');
            header.style.cssText = `
                font-size: 16px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            `;
            header.innerHTML = `${section.icon} ${section.title}`;
            sectionDiv.appendChild(header);

            // Content container
            const content = document.createElement('div');
            content.style.cssText = `
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
            `;

            // English version
            const enDiv = document.createElement('div');
            enDiv.style.cssText = `
                padding: 10px;
                background: #fff;
                border-radius: 4px;
                border: 1px solid #e9ecef;
            `;
            enDiv.innerHTML = `
                <div style="color: #666; font-size: 12px; margin-bottom: 5px;">English</div>
                <div style="color: #000;">${section.en}</div>
            `;

            // Vietnamese version
            const viDiv = document.createElement('div');
            viDiv.style.cssText = `
                padding: 10px;
                background: #fff;
                border-radius: 4px;
                border: 1px solid #e9ecef;
            `;
            viDiv.innerHTML = `
                <div style="color: #666; font-size: 12px; margin-bottom: 5px;">Vietnamese</div>
                <div style="color: #000;">${section.vi}</div>
            `;

            content.appendChild(enDiv);
            content.appendChild(viDiv);
            sectionDiv.appendChild(content);
            mainDiv.appendChild(sectionDiv);
        });

        container.appendChild(mainDiv);
    }

    render() {
        return this.button;
    }
} 