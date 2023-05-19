for (let i = 0; i < 1000; i++) {
  fetch('http://localhost:8080')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => {
      if (error.name === 'AbortError') {
        console.log('Request aborted.');
      } else {
        console.error('Request error:', error);
      }
    });
}
