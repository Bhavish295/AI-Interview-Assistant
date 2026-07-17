let token=prompt("Enter Admin Token");

async function addQuestion(){
    const category=document.getElementById("category").value;
    const difficulty=document.getElementById("difficulty").value;
    const question=document.getElementById("question").value;
    const keywords=document.getElementById("keywords").value.split(",");

    await fetch("http://localhost:5000/api/admin/add-question",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "x-token":token
        },
        body:JSON.stringify({category,difficulty,question,keywords})
    });

    alert("Added");
}
