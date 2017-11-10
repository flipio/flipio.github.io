
; (function (window, document) {
    'use strict'

        
    SimpleJekyllSearch({
        searchInput: document.getElementById('search-posts'),
        resultsContainer: document.getElementById('results-container'),
        json: '/data/search.json'
    });


})(window, document)
