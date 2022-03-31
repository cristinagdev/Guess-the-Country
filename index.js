
class Quiz{

    countries = [];
    data = {};
    container= document.querySelector('.output');
    answersdiv= document.querySelector('.answers');
    questiondiv = document.querySelector('.question');
    scoreItem= document.querySelector('.score_item');

    constructor(){
        this.startGame();
        
    }

//Inicio del juego
    startGame(){
        localStorage.setItem('score', 0);
        this.answersdiv.innerHTML="";
        this.questiondiv.innerHTML="";
        const startTitle= document.createElement('h2');
        startTitle.className='title';
        startTitle.innerText='Start here';
        this.answersdiv.append(startTitle);
        const startButton= this.createButton('button', 'btn', 'Start', this.answersdiv);
        startButton.addEventListener('click', ()=> this.renderQuestion());
    }


//Devuelve todos los países de la API
    async getCountries(){

        try{
            const response= await fetch('https://restcountries.com/v3.1/region/europe');
            const countries= await response.json();
            return countries;
        }catch(error){
            console.log(error);
        }
    }

//Devuelve la capital, los paises de respuesta y la correcta
    async getCountry(){
        try {
            this.countries= await this.getCountries();
    
        const countryRamdom= this.getRamdomCountries(this.countries);
        
        return {
            capital: countryRamdom.capital,
            answers: this.getAnswers(this.countries, countryRamdom),
            correct: countryRamdom.name.common
        }
        } catch (error) {
            console.log(error);
        }
        
    }

//Renderiza las preguntas y respuestas
    async renderQuestion(){

        this.answersdiv.innerHTML="";
        const answer= await this.getCountry();
        this.data= answer;
        const {capital, answers}=  this.data;
        
        this.questiondiv.innerHTML="";
        const question= document.createElement('h2');
        question.innerText= `${capital} is the capital of...`;
        question.className='question';
        this.questiondiv.append(question);

        answers.forEach((answer)=> {
            const button= this.createButton('button', 'btn', answer, this.answersdiv);
            button.addEventListener('click', (e)=> this.validateAnswer(e));
        });
        let score= parseInt(localStorage.getItem('score')) ;
        this.scoreItem.textContent= `Score: ${score}`;
    };


//valida la respuesta correcta
    validateAnswer(event){
        
        const selectedAnswer= event.target.textContent;
        const {correct} = this.data;

        if(selectedAnswer == correct){
            event.target.className= 'correct';
            
            const button = this.createButton('button', 'btn_next', 'Next', this.answersdiv);
            button.addEventListener('click', (e)=> this.handlerAnswers(e));
            button.addEventListener('click', ()=> this.renderQuestion());

        }else{
            event.target.className= 'incorrect';
            document.getElementById(correct).className='correct';
            const button= this.createButton('button', 'btn_next', 'Next', this.answersdiv);
            button.addEventListener('click', ()=> this.gameOver(selectedAnswer, correct));
        }
    }


//Devuelve países ramdom por posición ramdom
    getRamdomCountries(countries){
        const max= this.countries.length
        const num= Math.floor(Math.random() * (max -0) +0);
        return countries[num];
    }

//Devuelve las respuestas posibles que aparecerán
    getAnswers(countries, ramdomCountry){

        const countriesList= [ramdomCountry.name.common];

        while(countriesList.length < 4){
            const country= this.getRamdomCountries(countries).name.common;
            if(!countriesList.includes(country)){
                countriesList.push(country);
            }
        }
        
        return countriesList.sort(()=> Math.random() - 0.5);
    }

//Crea botones
    createButton(element, tag , content,  htmlContainer){
        const elementCreated = document.createElement(element);
        elementCreated.className= tag;
        elementCreated.innerText=content;
        elementCreated.setAttribute('id', content );
        htmlContainer.append(elementCreated);
        return elementCreated;
    }

//Acumula la puntuación
    handlerAnswers(event){
        if(event){
            let score= parseInt(localStorage.getItem('score')) ;
            score++;
            this.scoreItem.textContent= `Score: ${score} `;
            localStorage.setItem('score', score);
        }
    }

//Fin del juego.Restaura la puntuación.
    gameOver(selectedAnswer, correct){

        if(selectedAnswer != correct){
            let score= parseInt(localStorage.getItem('score')) ;
            
            this.answersdiv.innerHTML="";
            this.questiondiv.innerHTML="";
            const question= document.createElement('h2');
            question.innerText= `Results`;
            question.className='question';
            this.questiondiv.append(question);

            this.scoreItem.textContent= `You got ${score} correct answers!`;
            this.answersdiv.append(this.scoreItem);
            
            const button= this.createButton('button', 'btn_next', 'Try again', this.answersdiv);
            
            button.addEventListener('click', ()=> this.startGame());
        }
    }



}

const quiz= new Quiz();