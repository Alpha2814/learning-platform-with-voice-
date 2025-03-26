// Function to handle search via typing
document.getElementById("search-bar").addEventListener("input", function() {
    let query = this.value.trim();
    if (query) {
        fetchSearchResults(query);
    } else {
        document.getElementById("search-results").innerHTML = '';
    }
});

// Function to fetch search results using the Google Custom Search API
function fetchSearchResults(query) {
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your Google API key
    const cx = 'YOUR_GOOGLE_CX'; // Replace with your Custom Search Engine ID

    axios.get(`https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}`)
        .then(response => {
            displaySearchResults(response.data.items);
        })
        .catch(error => {
            console.error("Error fetching search results: ", error);
            document.getElementById("search-results").innerHTML = "<p>Error fetching results. Please try again later.</p>";
        });
}

// Function to display search results on the page
function displaySearchResults(results) {
    let output = '';
    if (results && results.length > 0) {
        results.forEach(result => {
            output += `
                <div class="search-result">
                    <h3><a href="${result.link}" target="_blank">${result.title}</a></h3>
                    <p>${result.snippet}</p>
                </div>
            `;
        });
    } else {
        output = "<p>No results found. Try a different search query.</p>";
    }
    document.getElementById("search-results").innerHTML = output;
}

// Function to start voice search using the Web Speech API
document.getElementById("voice-search-btn").addEventListener("click", function() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("search-bar").value = transcript;
        fetchSearchResults(transcript);  // Perform the search with the voice query
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error: ', event.error);
        alert("Sorry, there was an error with voice recognition. Please try again.");
    };
};
