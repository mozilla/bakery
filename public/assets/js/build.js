'use strict';

$(document).ready(function() {

    // Show URL form when checkboxes are clicked
    (function() {
        $('#modifications .page input[type="checkbox"]').change(function() {
            $(this).closest('.page').find('.url').toggleClass('hidden');
        });
    }());

    // Fake progress
    (function() {
        $('#build-funnelcake').submit(function(event) {
            event.preventDefault();

            $(this).remove();

            var messages = [
                'Building funnelcake',
                'Updating funnelcake master tracker',
                'Publishing experiment details',
            ];

            var $statusUL = $('main').append('<section id="status"><h1>Status</h1></section>').find('#status').append('<ul>').find('ul');
            fakeStatus($statusUL, messages);

            setTimeout(function() {
                var $resultsUL = $('main').append('<section id="results"><h1>Results</h1></section>').find('#results').append('<ul>').find('ul');
                $resultsUL.append('<li><a href="http://example.com?funnelcake-example-b">Experiment details</a></li>');
                $resultsUL.append('<li><a href="http://example.com?funnelcake-example-a">Funnelcake</a></li>');
                $resultsUL.append('<br><input type="submit" id="ABTest" value="Create A/B Test"></input>');

                var messages = [
                    'Building A/B Test',
                    'Adding Specified Options',
                    'Beginning Distribution',
                ];

                var abTestButton = document.getElementById('ABTest');
                abTestButton.addEventListener('click', function() {
                    $('main').empty();
                    var $statusUL = $('main').append('<section id="ABStatus"><h1>Status</h1></section>').find('#ABStatus').append('<ul>').find('ul');
                    fakeStatus($statusUL, messages);

                    setTimeout(function() {
                        var $resultsUL = $('main').append('<section id="ABResults"><h1>Results</h1></section>').find('#ABResults').append('<ul>').find('ul');
                        $resultsUL.append('<li><a href="http://example.com?distribution-link">Live Distribution</a></li>');
                    }, 7500);

                }, false);
            }, 7500);
        });

        function fakeStatus($statusUL, messages) {

            function addMessage() {
                $statusUL.append('<li>' + messages.shift() + '</li>');

                var dots = 0;
                var addDots = setInterval(function() {
                    $statusUL.find('li:last-child').append('.');
                    dots++;

                    if (dots === 3) {
                        clearInterval(addDots);
                    }
                }, 500);

                setTimeout(function() {
                    $statusUL.find('li:last-child').append(' done');
                }, 2000);
            }

            addMessage();
            var addMessages = setInterval(function() {
                addMessage();

                if (messages.length === 0) {
                    clearInterval(addMessages);
                }
            }, 2500);
        }
    }());

});
