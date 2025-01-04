const params = new URLSearchParams(window.location.search);
const output = document.getElementById('output');

const titulo = document.getElementsByTagName("h1")


    params.forEach(async (id, key) => {
        console.log(`${key}: ${id}`)
        if (key == 'idEvento'){
            try{
                const response = await fetch('evento/idEvent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({id}),
                });
    
                const data = await response.json()
    
                if(response.ok){
                    console.log(data)
                } else {
                throw new Error(`Error durante la obtención del evento: ${response}`)
                }
            } catch (error) {
                throw new Error(`Error grave durante la obtención del evento: ${error}`)
            }
        }
    });