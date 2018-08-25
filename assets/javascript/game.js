// Create character objects
var charactersObj = {
  rey: {
    name: "Rey",
    hp: 120,
    attackPower: 8,
    baseAttackPower: 8,
    counterAttackPower: 11
  },
  kylo: {
    name: "Kylo",
    hp: 125,
    attackPower: 4,
    baseAttackPower: 4,
    counterAttackPower: 20
  },
  finn: {
    name: "Finn",
    hp: 115,
    attackPower: 9,
    baseAttackPower: 9,
    counterAttackPower: 7
  },
  snoke: {
    name: "Snoke",
    hp: 100,
    attackPower: 6,
    baseAttackPower: 6,
    counterAttackPower: 25
  }
};

$(document).ready(function () {
  // Declare DOM nodes
  var $charSelectDiv = $('#character-select');
  var $playerDiv = $('#player');
  var $enemiesDiv = $('#enemies');
  var $fightDiv = $('#fight');
  var $defenderDiv = $('#defender');
  var $message = $('#message');
  var $attack = $('#attack');
  var $reset = $('#reset');

  // Declare global variables
  var charName;
  var charClassSelector;
  var defenderActive = false;
  var playerCharacter;
  var enemyCharacter;
  var enemiesToDefeat = $charSelectDiv.children('.character').length -1;
  var enemiesDefeated = 0;
  var losses = 0;

  function reset() {
    charName = "";
    charClassSelector = "";
    defenderActive = false;
    $charSelectDiv.removeClass('d-none');
    $charSelectDiv.append($('.character'));
    $charSelectDiv.children('.character').each(function () {
      $(this).removeClass('d-none')
    });
    $fightDiv.addClass('d-none');
    $message.html("");
    $reset.addClass('d-none');
    $playerDiv.addClass('d-none');
    $defenderDiv.addClass('d-none');
    $enemiesDiv.addClass('d-none');
    enemiesDefeated = 0;
    charactersObj.rey.hp = 120;
    charactersObj.rey.attackPower = charactersObj.rey.baseAttackPower;
    charactersObj.kylo.hp = 125;
    charactersObj.kylo.attackPower = charactersObj.kylo.baseAttackPower;
    charactersObj.finn.hp = 115;
    charactersObj.finn.attackPower = charactersObj.finn.baseAttackPower;
    charactersObj.snoke.hp = 100;
    charactersObj.snoke.attackPower = charactersObj.snoke.baseAttackPower;
    update();
  };

  function update() {
    $('.rey .hp').text(charactersObj.rey.hp);
    $('.kylo .hp').text(charactersObj.kylo.hp);
    $('.finn .hp').text(charactersObj.finn.hp);
    $('.snoke .hp').text(charactersObj.snoke.hp);
  }

  function healthCheck() {

    if (playerCharacter.hp < 1) {
      playerCharacter.hp = 0;
      losses++;
      if (losses > 2) {
        $message.html('<p>You have been defeated... GAME OVER!</p>' + 
        '<p>Don\'t get discouraged... it is possible to win with every character!</p>');
      } else {
        $message.html('<p>You have been defeated... GAME OVER!</p>');
      }
      $attack.addClass('d-none');
      $reset.removeClass('d-none');
    };
    if (enemyCharacter.hp < 1) {
      
      enemyCharacter.hp = 0;
      $message.html('<p>You have defeated ' + enemyCharacter.name + '! Select a new enemy to fight.</p>');
      enemiesDefeated++;
      $attack.addClass('d-none');
      $defenderDiv.addClass('d-none');
      $charSelectDiv.append($defenderDiv.find(charClassSelector));
      defenderActive = false;

      // Check for win condition
      if (enemiesDefeated ===  enemiesToDefeat) {
        $message.html("<p>You win! Click restart to play again.</p>");
        $attack.addClass('d-none');
        $reset.removeClass('d-none');
      }
    }
  }

  function attack(callback) {
    if (defenderActive && playerCharacter.hp > 0) {
    
      // Deal damage to the enemy
      enemyCharacter.hp -= playerCharacter.attackPower;

      // Enemy only counterattacks if they are still alive
      if (enemyCharacter.hp > 1) {
        playerCharacter.hp -= enemyCharacter.counterAttackPower;
      }

      // Display damage
      $message.html(
        "<p>You attacked " + enemyCharacter.name + " for " + playerCharacter.attackPower + " damage.</p>" + 
        "<p>" + enemyCharacter.name + " attacked you back for " + enemyCharacter.counterAttackPower + " damage.</p>"
      );

      // Increase player attack power
      playerCharacter.attackPower += playerCharacter.baseAttackPower;

    } else {
      // If no enemy is preset, display a message
      $message.html('<p>No enemy present. Please select an enemy to attack</p>');
    }    
    callback();
  }

  // Reset game when clicked
  $('#reset').on('click', reset);

  // When a character in the character select area is clicked
  $('#character-select').on('click', '.character', function () {

    $charSelectDiv.addClass('d-none');

    // Store the class name of the element clicked
    charName = $(this).attr('data-name');
    charClassSelector = '.' + charName;

    // Show the corresponding character card in the player div
    $playerDiv.removeClass('d-none');
    $enemiesDiv.removeClass('d-none');
    $playerDiv.append($(this));

    // Set the playerCharacter variable to the corresponding character object
    playerCharacter = charactersObj[charName];

    // Iterate over the remaining characters and place them in #enemies
    $charSelectDiv.children('.character').each(function () {
      $enemiesDiv.append($(this));
    });
  });

  $('#enemies').on('click', '.character', function () {

    // If no defender is active
    if (!defenderActive) {

      // set character selection variables
      charName = $(this).attr('data-name');
      charClassSelector = '.' + charName;

      // Hide the clicked character in #enemies
      // $enemiesDiv.find(charClassSelector).addClass('d-none');

      // Show the clicked character in #defender
      $defenderDiv.removeClass('d-none');
      // $defenderDiv.find(charClassSelector).removeClass('d-none');
      $defenderDiv.append($(this));

      // Show the fight/message area and attack button
      $fightDiv.removeClass('d-none');
      $attack.removeClass('d-none');

      // Set the enemyCharacter variable to the corresponding character object
      enemyCharacter = charactersObj[charName];
      
      $message.html('<p>Prepare for battle!</p>');

      // Hide #enemies when no more are left
      if ($enemiesDiv.children('.character').length ===  0) {
        $enemiesDiv.addClass('d-none');
      }

      defenderActive = true;
    }
  });

  // Attack button functionality
  $attack.on('click', function () {
    if (defenderActive) {
      attack(healthCheck);
      update();
    } else {
      $message.html("<p>Select a new enemy to attack.</p>");
    }
  });
});