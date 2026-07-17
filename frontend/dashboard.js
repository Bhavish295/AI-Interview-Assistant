let token=prompt("Enter Token");

async function loadData(){

    const res=await fetch("http://localhost:5000/api/interview/dashboard",{
        headers:{"x-token":token}
    });

    const data=await res.json();
    let scores=data.map(d=>d.score);

    new Chart(document.getElementById("chart"),{
        type:'line',
        data:{
            labels:scores.map((_,i)=>"Interview "+(i+1)),
            datasets:[{label:"Score",data:scores}]
        },
        options:{
            responsive:true,
            plugins:{
                legend:{display:true}
            }
        }
    });
}

loadData();
