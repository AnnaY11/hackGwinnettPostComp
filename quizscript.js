// A personality quiz

// This is an array of objects that stores the personality trait that is prompted to the user and the weight for each prompt. 
// If a personality trait is considered more introverted, it will have a negative weight.
// If a personlity trait is considered more extroverted, it will have a positive weight.

var prompts = [
    {
        prompt: 'I check the status of my investments on a daily basis.',
        weight: 1,
        class: 'group0'
    },
    {
        prompt: 'When considering an investment, I typically dont conduct much research and insted go with my gut feeling.',
        weight: -1,
        class: 'group1'
    },
    {
        prompt: 'I prefer individual stocks and activly managed funds over real estate and other alternative investments.',
        weight: 1,
        class: 'group2'
    },
    {
        prompt: 'When faced with market votality, I make quick trades to capitalize on fluctuations.',
        weight: 1,
        class: 'group3'
    },
    {
        prompt: 'My investment goal is to generate passive income through multiple avenues.',
        weight: -1,
        class: 'group4'
    },
    {
        prompt: "I'm willing to pay higher fees on my investments if it means I get active management.",
        weight: 1,
        class: 'group5'
    },
    {
        prompt: 'I make investment descisions by following market trends and analyst reccomendations closely',
        weight: 1,
        class: 'group6'
    },
    {
        prompt: 'When I invest I focus on minimizing risk above all else.',
        weight: -1,
        class: 'group7'
    },
    {
        prompt: 'I am comfortable commiting to long-term investments if they have promising returns',
        weight: -1,
        class: 'group8'
    },
    {
        prompt: 'I always use automations when managing my investments.',
        weight: -1,
        class: 'group9'
    },
    {
        prompt: 'I activly try to time the market for better gains',
        weight: 1,
        class: 'group10'
    },
    {
        prompt: 'When I see news and market updates, I prefer to ignore it and stick to my investment plan rather than making immediate changes to my porfolio.',
        weight: -1,
        class: 'group11'
    }
    
    ]
    
    // This array stores all of the possible values and the weight associated with the value. 
    // The stronger agreeance/disagreeance, the higher the weight on the user's answer to the prompt.
    var prompt_values = [
    {
        value: 'Strongly Agree', 
        class: 'btn-default btn-strongly-agree',
        weight: 5
    },
    {
        value: 'Agree',
        class: 'btn-default btn-agree',
        weight: 3,
    }, 
    {
        value: 'Neutral', 
        class: 'btn-default',
        weight: 0
    },
    {
        value: 'Disagree',
        class: 'btn-default btn-disagree',
        weight: -3
    },
    { 
        value: 'Strongly Disagree',
        class: 'btn-default btn-strongly-disagree',
        weight: -5
    }
    ]
    
    // For each prompt, create a list item to be inserted in the list group
    function createPromptItems() {
    
        for (var i = 0; i < prompts.length; i++) {
            var prompt_li = document.createElement('li');
            var prompt_p = document.createElement('p');
            var prompt_text = document.createTextNode(prompts[i].prompt);
    
            prompt_li.setAttribute('class', 'list-group-item prompt');
            prompt_p.appendChild(prompt_text);
            prompt_li.appendChild(prompt_p);
    
            document.getElementById('quiz').appendChild(prompt_li);
        }
    }
    
    // For each possible value, create a button for each to be inserted into each li of the quiz
    // function createValueButtons() {
        
    // 	for (var li_index = 0; li_index < prompts.length; li_index++) {
    // 		for (var i = 0; i < prompt_values.length; i++) {
    // 			var val_button = document.createElement('button');
    // 			var val_text = document.createTextNode(prompt_values[i].value);
    
    // 			val_button.setAttribute('class', 'value-btn btn ' + prompt_values[i].class);
    // 			val_button.appendChild(val_text);
    
    // 			document.getElementsByClassName('prompt')[li_index].appendChild(val_button);
    // 		}
    // 	}
    // }
    function createValueButtons() {
        for (var li_index = 0; li_index < prompts.length; li_index++) {
            var group = document.createElement('div');
            group.className = 'btn-group btn-group-justified';
    
            for (var i = 0; i < prompt_values.length; i++) {
                var btn_group = document.createElement('div');
                btn_group.className = 'btn-group';
    
                var button = document.createElement('button');
                var button_text = document.createTextNode(prompt_values[i].value);
                button.className = 'group' + li_index + ' value-btn btn ' + prompt_values[i].class;
                button.appendChild(button_text);
    
                btn_group.appendChild(button);
                group.appendChild(btn_group);
    
                document.getElementsByClassName('prompt')[li_index].appendChild(group);
            }
        }
    }
    
    createPromptItems();
    createValueButtons();
    
    // Keep a running total of the values they have selected. If the total is negative, the user is introverted. If positive, user is extroverted.
    // Calculation will sum all of the answers to the prompts using weight of the value * the weight of the prompt.
    var total = 0;
    
    // Get the weight associated to group number
    function findPromptWeight(prompts, group) {
        var weight = 0;
    
        for (var i = 0; i < prompts.length; i++) {
            if (prompts[i].class === group) {
                weight = prompts[i].weight;
            }
        }
    
        return weight;
    }
    
    // Get the weight associated to the value
    function findValueWeight(values, value) {
        var weight = 0;
    
        for (var i = 0; i < values.length; i++) {
            if (values[i].value === value) {
                weight = values[i].weight;
            }
        }
    
        return weight;
    }
    
    // When user clicks a value to agree/disagree with the prompt, display to the user what they selected
    $('.value-btn').mousedown(function () {
        var classList = $(this).attr('class');
        // console.log(classList);
        var classArr = classList.split(" ");
        // console.log(classArr);
        var this_group = classArr[0];
        // console.log(this_group);
    
        // If button is already selected, de-select it when clicked and subtract any previously added values to the total
        // Otherwise, de-select any selected buttons in group and select the one just clicked
        // And subtract deselected weighted value and add the newly selected weighted value to the total
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            total -= (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $(this).text()));
        } else {
            // $('[class='thisgroup).prop('checked', false);
            total -= (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $('.'+this_group+'.active').text()));
            // console.log($('.'+this_group+'.active').text());
            $('.'+this_group).removeClass('active');
    
            // console.log('group' + findValueWeight(prompt_values, $('.'+this_group).text()));
            // $(this).prop('checked', true);
            $(this).addClass('active');
            total += (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $(this).text()));
        }
    
        console.log(total);
    })
    
    
    
    $('#submit-btn').click(function () {
        // After clicking submit, add up the totals from answers
        // For each group, find the value that is active
        $('.results').removeClass('hide');
        $('.results').addClass('show');
        
        if(total < -5) {
            // document.getElementById('intro-bar').style.width = ((total / 60) * 100) + '%';
            // console.log(document.getElementById('intro-bar').style.width);
            // document.getElementById('intro-bar').innerHTML= ((total / 60) * 100) + '%';
            document.getElementById('results').innerHTML = '<b>You are a passive investor!</b><br><br>\
            You favor a more hands-off approach, focusing on long-term growth.\n\
    <br><br>\
    You believe in the power of long-term strategies and often opt for low-maintenance options like index funds and robo-advisors.\n\
    <br><br>\
    You may not follow market trends closely and instead focus on a well-diversified portfolio that can grow over time. Your approach minimizes stress and effort, allowing you to avoid the pitfalls of market timing and emotional decision-making.\n\n\
    <br><br>\
    While your returns may not always beat the market, your strategy prioritizes consistency and lower fees, aligning with your goal of steady, sustainable growth.\
            ';
        } else if(total > 5) {
            document.getElementById('results').innerHTML = '<b>You are an active investor!</b><br><br>\
            As an active investor, you thrive on engagement with the markets. You prefer to take charge of your investments, researching extensively and making decisions based on your analysis.\
    <br><br>\
    You enjoy monitoring trends, reacting to market movements, and may frequently buy and sell stocks.\
    <br><br>\
    You believe that with the right information and timing, you can outperform the market.\
    <br><br>\
    Your hands-on approach can lead to higher returns, but it also comes with greater risk and requires significant time and effort.';
        } else {
            document.getElementById('results').innerHTML = '<b>You are a balanced investor!</b><br><br>\
            You embody a balanced approach to investing, blending active and passive strategies.\
    <br><br>\
    You recognize the value of thorough research and market engagement but also appreciate the benefits of a long-term perspective.\
    <br><br>\
    You might actively manage some parts of your portfolio while relying on index funds or automated tools for others.\
    <br><br>\
    This balanced strategy allows you to adapt to changing market conditions while maintaining a stable investment foundation. You understand that both approaches have their merits, and you tailor your strategy based on your goals and market environment.'
        }
    
        // Hide the quiz after they submit their results
        $('#quiz').addClass('hide');
        $('#submit-btn').addClass('hide');
        $('#retake-btn').removeClass('hide');
    })
    
    // Refresh the screen to show a new quiz if they click the retake quiz button
    $('#retake-btn').click(function () {
        $('#quiz').removeClass('hide');
        $('#submit-btn').removeClass('hide');
        $('#retake-btn').addClass('hide');
    
        $('.results').addClass('hide');
        $('.results').removeClass('show');
    })
