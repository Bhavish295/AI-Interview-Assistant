let token="";
let questions=[];
let current=0;
let score=0;
let timer;
let answersDetail=[];
let recognitionInstance=null;

async function register(){
    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value;

    if(!username || !password){
        alert("Please enter username and password.");
        return;
    }

    try {
        const res=await fetch("http://localhost:5000/api/auth/register",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username,password})
        });

        const data=await res.json().catch(()=>({}));

        if(res.ok){
            alert("Registered! Login now.");
        } else {
            alert(data.message || data.msg || data || "Registration failed. Try a different username.");
        }
    } catch(err){
        console.error(err);
        alert("Cannot reach server. Is the backend running on http://localhost:5000 ?");
    }
}

async function login(){
    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value;

    if(!username || !password){
        alert("Please enter username and password.");
        return;
    }

    try {
        const res=await fetch("http://localhost:5000/api/auth/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username,password})
        });

        const data=await res.json().catch(()=>({}));

        if(res.ok && data.token){
            token=data.token;
            document.getElementById("authSection").classList.add("hidden");
            document.getElementById("interviewSetup").classList.remove("hidden");
        } else {
            alert(data.message || data.msg || data || "Login failed. Check username and password.");
        }
    } catch(err){
        console.error(err);
        alert("Cannot reach server. Is the backend running on http://localhost:5000 ?");
    }
}

async function startInterview() {
    const categoryEl = document.getElementById("category");
    const difficultyEl = document.getElementById("difficulty");
    const category = categoryEl.value;
    const difficulty = difficultyEl.value;

    const resumeFile = document.getElementById("resumeFile").files[0];
    let resumeText = "";

    if (resumeFile && resumeFile.type.startsWith("text/")) {
        resumeText = await resumeFile.text();
    }

    const params = new URLSearchParams();
    params.append("category", category);
    params.append("difficulty", difficulty);

    if (resumeText) {
        params.append("resumeHint", encodeURIComponent(resumeText.slice(0, 500)));
    }

    try {
        const res = await fetch(`http://localhost:5000/api/interview/questions?${params.toString()}`, {
            headers: { "x-token": token }
        });

        if (!res.ok) {
            throw new Error("Failed to load interview questions.");
        }

        questions = await res.json();

        if (!Array.isArray(questions) || questions.length === 0) {
            alert("No interview questions found.");
            return;
        }

    } catch (err) {
        console.error(err);
        alert("Backend is not running or interview questions could not be loaded.");
        return;
    }

    current = 0;
    score = 0;
    answersDetail = [];

    document.getElementById("interviewSetup").classList.add("hidden");
    document.getElementById("interviewSection").classList.remove("hidden");

    updateProgressUI();
    loadQuestion();
}
function loadQuestion(){
    const q=questions[current];
    document.getElementById("question").innerText=q.question;
    document.getElementById("answer").value="";
    document.getElementById("liveTranscript").innerText="";
    document.getElementById("feedbackPanel").classList.add("hidden");
    updateProgressUI();
    startTimer();
}

function startTimer(){
    clearInterval(timer);
    let timeLeft=30;
    document.getElementById("timer").innerText=timeLeft;

    timer=setInterval(()=>{
        timeLeft--;
        document.getElementById("timer").innerText=timeLeft;
        if(timeLeft<=0){
            clearInterval(timer);
            submitAnswer(true);
        }
    },1000);
}

function submitAnswer(autoFromTimer=false){
    clearInterval(timer);
    const ansRaw=document.getElementById("answer").value || "";
    const ans=ansRaw.toLowerCase();
    const q=questions[current];

    const totalKeywords=(q.keywords || []).length || 1;
    let hits=0;
    (q.keywords || []).forEach(k=>{
        if(ans.includes(k.toLowerCase().trim())) hits++;
    });
    const localScore=hits>0?1:0;
    const confidence=Math.round((hits/totalKeywords)*100);
    score+=localScore;

    const strength=hits>0?"You covered some of the key ideas the interviewer is looking for.":"You attempted an answer, but key concepts were missing.";
    const weak=hits<totalKeywords?"You can add more concrete details around the core concepts and examples from real projects.":"You could still polish the structure and examples to make it crisper.";
    const suggestion=`Include keywords like: ${(q.keywords || []).join(", ")} and walk through a clear, step‑by‑step explanation with a short example.`;

    document.getElementById("fbStrengths").innerText=strength;
    document.getElementById("fbWeak").innerText=weak;
    document.getElementById("fbSuggestion").innerText=suggestion;
    document.getElementById("fbConfidence").innerText=confidence+"%";
    document.getElementById("feedbackPanel").classList.remove("hidden");

    answersDetail.push({
        questionId:q._id || null,
        question:q.question,
        answer:ansRaw,
        hits,
        totalKeywords,
        score:localScore,
        confidence,
        strengths:strength,
        weaknesses:weak,
        suggestion
    });

    updateProgressUI();

    if(!autoFromTimer){
        setTimeout(nextQuestion,1200);
    }else{
        nextQuestion();
    }
}

function retakeAnswer(){
    clearInterval(timer);
    document.getElementById("answer").value="";
    document.getElementById("liveTranscript").innerText="";
    document.getElementById("feedbackPanel").classList.add("hidden");
    startTimer();
}

function updateProgressUI(){
    const progressText=document.getElementById("progressText");
    const liveScore=document.getElementById("liveScore");
    const progressFill=document.getElementById("progressFill");

    const total=questions.length || 1;
    const questionNumber=current+1;

    if(progressText){
        progressText.innerText=`Question ${Math.min(questionNumber,total)}/${total}`;
    }
    if(liveScore){
        liveScore.innerText=`Score: ${score}`;
    }
    if(progressFill){
        const pct=Math.min((current/total)*100,100);
        progressFill.style.width=pct+"%";
    }
}

function playQuestionVoice(){
    const q=questions[current];
    if(!q || !window.speechSynthesis) return;
    const utterance=new SpeechSynthesisUtterance(q.question);
    utterance.rate=1;
    utterance.pitch=1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function nextQuestion(){
    current++;
    document.getElementById("answer").value="";

    if(current<questions.length) loadQuestion();
    else showResult();
}

async function showResult(){
    document.getElementById("interviewSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");

    document.getElementById("score").innerText=score+" / "+questions.length;

    await fetch("http://localhost:5000/api/interview/result",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "x-token":token
        },
        body:JSON.stringify({
            score,
            total:questions.length,
            category:(questions[0] && questions[0].category) || "Mixed",
            answers:answersDetail
        })
    });

    try{
        const dashRes=await fetch("http://localhost:5000/api/interview/dashboard",{
            headers:{"x-token":token}
        });
        const data=await dashRes.json();
        populateSummaryFromHistory(data);
    }catch(e){
    }
}

function populateSummaryFromHistory(history){
    if(!Array.isArray(history) || history.length===0) return;

    const avg=history.reduce((acc,r)=>acc+(r.score/(r.total || 1)),0)/history.length;
    document.getElementById("avgScore").innerText="Average score: "+(avg*100).toFixed(1)+"%";

    const topicStats={};
    history.forEach(r=>{
        const cat=r.category || "General";
        if(!topicStats[cat]) topicStats[cat]={score:0,total:0};
        topicStats[cat].score+=r.score;
        topicStats[cat].total+=r.total || 1;
    });

    let strongest=null;
    let weakest=null;
    Object.keys(topicStats).forEach(cat=>{
        const ratio=topicStats[cat].score/topicStats[cat].total;
        if(strongest===null || ratio>strongest.ratio) strongest={cat,ratio};
        if(weakest===null || ratio<weakest.ratio) weakest={cat,ratio};
    });

    if(strongest){
        document.getElementById("strongestTopic").innerText="Strongest topic: "+strongest.cat;
    }
    if(weakest){
        document.getElementById("weakestTopic").innerText="Weakest topic: "+weakest.cat;
    }

    document.getElementById("improvement").innerText="Improvement suggestion: focus more practice on your weakest topic and prepare 2–3 structured stories you can reuse across questions.";

    const lastFive=history.slice(-5);
    const lastFiveScores=lastFive.map(r=>r.score);
    const lastFiveLabels=lastFive.map((_,i)=>"Interview "+(history.length-lastFive.length+i+1));

    const allScores=history.map(r=>r.score);
    const allLabels=history.map((_,i)=>"Interview "+(i+1));

    if(window.Chart){
        const lastCtx=document.getElementById("lastFiveChart");
        const allCtx=document.getElementById("allScoresChart");

        new Chart(lastCtx,{
            type:"line",
            data:{
                labels:lastFiveLabels,
                datasets:[{
                    label:"Score",
                    data:lastFiveScores,
                    borderColor:"#22c55e",
                    backgroundColor:"rgba(34,197,94,0.2)",
                    tension:0.3
                }]
            },
            options:{responsive:true}
        });

        new Chart(allCtx,{
            type:"bar",
            data:{
                labels:allLabels,
                datasets:[{
                    label:"Score",
                    data:allScores,
                    backgroundColor:"rgba(59,130,246,0.5)"
                }]
            },
            options:{responsive:true}
        });
    }
}

function startVoice(){
    if(!("webkitSpeechRecognition" in window)) return;

    if(recognitionInstance){
        recognitionInstance.stop();
        recognitionInstance=null;
    }

    const recognition=new webkitSpeechRecognition();
    recognition.lang="en-US";
    recognition.continuous=true;
    recognition.interimResults=true;

    recognition.onresult=function(e){
        let finalTranscript="";
        let interimTranscript="";
        for(let i=0;i<e.results.length;i++){
            const res=e.results[i];
            if(res.isFinal) finalTranscript+=res[0].transcript+" ";
            else interimTranscript+=res[0].transcript+" ";
        }
        const combined=(finalTranscript+interimTranscript).trim();
        document.getElementById("answer").value=combined;
        document.getElementById("liveTranscript").innerText=combined;
    };

    recognition.onend=function(){
        recognitionInstance=null;
    };

    recognitionInstance=recognition;
    recognition.start();
}
