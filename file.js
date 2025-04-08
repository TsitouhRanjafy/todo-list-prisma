async function getData() {
    const url = "http://localhost:8080/auth/register";
    try {
      const response = await fetch(url,{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: "raf", password: "azer" })
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(response.status);
        console.log(json.message);
        return;
      }
  
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
}

getData();
  