// Personality types and scores
const personalities = ["Sigma","Alpha","Beta","Omega"];
const personalityScores = { Sigma:0, Alpha:0, Beta:0, Omega:0 };

// Questions
const questions = [
  { question: "You’re working in a team. How do you act?", options:[
    {text:"Lead naturally", score:{Alpha:2}},
    {text:"Help quietly", score:{Sigma:2}},
    {text:"Follow instructions", score:{Beta:2}},
    {text:"Avoid group tasks", score:{Omega:2}}
  ]},
  { question: "You have free time. What do you do?", options:[
    {text:"Read / Learn something new", score:{Sigma:2}},
    {text:"Socialize with friends", score:{Alpha:2}},
    {text:"Relax / Nap", score:{Beta:1}},
    {text:"Play video games", score:{Omega:1}}
  ]},
  { question: "How do you approach challenges?", options:[
    {text:"Strategize and plan", score:{Sigma:2}},
    {text:"Face them head-on", score:{Alpha:2}},
    {text:"Follow others’ lead", score:{Beta:2}},
    {text:"Avoid or postpone", score:{Omega:2}}
  ]},
  { question: "How do you react to criticism?", options:[
    {text:"Reflect silently and adjust", score:{Sigma:2}},
    {text:"Defend your position", score:{Alpha:2}},
    {text:"Take it lightly", score:{Beta:1}},
    {text:"Get demotivated", score:{Omega:2}}
  ]},
  { question: "Your friends describe you as?", options:[
    {text:"Independent and mysterious", score:{Sigma:2}},
    {text:"Confident and outgoing", score:{Alpha:2}},
    {text:"Friendly and supportive", score:{Beta:2}},
    {text:"Lazy or carefree", score:{Omega:2}}
  ]}
];

// DOM elements
let currentQuestion = 0;
const questionSection = document.getElementById("question-section");
const resultSection = document.getElementById("result-section");
const resultCard = document.getElementById("result-card");
const progressBar = document.getElementById("progress");

// Show a question
function showQuestion(index){
  questionSection.innerHTML = "";
  const q = questions[index];

  const card = document.createElement("div");
  card.className = "question-card";

  const title = document.createElement("h3");
  title.textContent = `Q${index+1}. ${q.question}`;
  card.appendChild(title);

  q.options.forEach(opt=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt.text;
    btn.onclick = ()=>{
      for(const key in opt.score) personalityScores[key] += opt.score[key];
      currentQuestion++;
      progressBar.style.width = `${(currentQuestion/questions.length)*100}%`;
      if(currentQuestion < questions.length) showQuestion(currentQuestion);
      else showResult();
    };
    card.appendChild(btn);
  });

  questionSection.appendChild(card);
}

// Show result
function showResult(){
  questionSection.style.display = "none";
  resultSection.style.display = "block";

  // Determine final personality
  let maxScore = -1, finalPersonality = "";
  for(const key in personalityScores){
    if(personalityScores[key] > maxScore){
      maxScore = personalityScores[key];
      finalPersonality = key;
    }
  }

  const tips = {
    Sigma: { description: "Independent, strategic, and productive.", improve: "Improve social skills for subtle influence.", maintain: "Keep planning tasks and reflecting on goals." },
    Alpha: { description: "Confident, outgoing, natural leader.", improve: "Work on listening and patience.", maintain: "Challenge yourself and lead by example." },
    Beta: { description: "Friendly, supportive, cooperative.", improve: "Take initiative in leadership roles.", maintain: "Maintain reliability and empathy." },
    Omega: { description: "Carefree, sometimes avoids responsibility.", improve: "Focus on discipline and goal-setting.", maintain: "Balance relaxation with productive habits." }
  };

  // Clear previous content
  resultCard.innerHTML = "";

  // Create DOM elements
  const title = document.createElement("h2");
  title.textContent = finalPersonality;
  resultCard.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = tips[finalPersonality].description;
  resultCard.appendChild(desc);

  const improve = document.createElement("p");
  improve.innerHTML = `<strong>Tips to Improve:</strong> ${tips[finalPersonality].improve}`;
  resultCard.appendChild(improve);

  const maintain = document.createElement("p");
  maintain.innerHTML = `<strong>Tips to Maintain:</strong> ${tips[finalPersonality].maintain}`;
  resultCard.appendChild(maintain);

  const restartBtn = document.createElement("a");
  restartBtn.className = "restart-btn";
  restartBtn.textContent = "Retake Test";
  restartBtn.onclick = restartTracker;
  resultCard.appendChild(restartBtn);
}

// Restart quiz
function restartTracker(){
  currentQuestion = 0;
  for(const key in personalityScores) personalityScores[key] = 0;
  resultSection.style.display = "none";
  questionSection.style.display = "block";
  progressBar.style.width = "0%";
  showQuestion(currentQuestion);
}

// Initialize quiz
showQuestion(currentQuestion);
