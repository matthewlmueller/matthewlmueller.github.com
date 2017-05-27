function hide_menu_show_game() {
        $("#logo_div").remove();
        $("#turn_length_div").remove();
        $("#number_teams_div").remove();
        $("#number_dice_sides_div").remove();
        $("#game_canvas").show();
}

function turn(){
        first_turn_taken = 1;
        current_dice_roll = roll_dice(number_dice_sides);

        // Check if the current dice roll would move the piece past the end of the board
        // If so - just set the current piece's posistion to the final tile
        if(piece_controlers[current_turn].current_tile + current_dice_roll >= 19){
                piece_controlers[current_turn].current_tile = 19;
        } else {
                piece_controlers[current_turn].current_tile += current_dice_roll;
        }

        if(piece_controlers[current_turn].current_tile == 8 || piece_controlers[current_turn].current_tile == 18){
                suprise_text.setText(suprise());
        }

        pieces[current_turn].x = game_info.board_tiles[piece_controlers[current_turn].current_tile][current_piece_x];
        pieces[current_turn].y = game_info.board_tiles[piece_controlers[current_turn].current_tile][current_piece_y];

        current_turn++;
        if(current_turn == number_teams){
                current_turn = 0;
        }

        current_piece_x = 'piece_'+ (current_turn+1) + '_x';
        current_piece_y = 'piece_'+ (current_turn+1) + '_y';
        update_popup();
};


function format_time (game_time){
        var total_time_seconds = game_time/1000;
        var minutes            = Math.floor(total_time_seconds / 60);
        var seconds            = Math.floor(total_time_seconds) - (60 * minutes);
        var time_string        = (minutes < 10) ? "0" + minutes : minutes; 
        time_string            += (seconds < 10) ? ":0" + seconds : ":" + seconds; 
        return time_string
};


// Takes the "size" of the dice (the largest number that can be rolled on it)
function roll_dice (dice_size){
        return Math.floor(Math.random() * (dice_size - 1 + 1)) + 1;
};

function suprise () {
        var suprise_card_index = roll_dice(game_info.surprise_card_descriptions.length-1);
        return game_info.surprise_card_descriptions[suprise_card_index];
};

// This should be changed - sprites are currently just being piled on top of each other, could theoretically use too much memory
function update_popup () {
        var current_piece_image = 'piece_'+ (current_turn+1) + '_image';
        var current_team_piece = game.add.sprite(235, 240, current_piece_image);
        var text = "Team " + (current_turn+1);
        current_team_text.setText (text);
       // popup_group.add(current_piece_image);
}


var board_state = {
        create: function () {
                hide_menu_show_game();

                board             = game.add.sprite(game.world.centerX, game.world.centerY, 'board_image');
                logo              = game.add.sprite(275, 200,'logo_image');
                popup_background  = game.add.sprite(220, 220,'popup_background_image');
                roll_button       = game.add.button(465, 725, 'dice_roll_button_image', turn, this);
                popup_group       = game.add.group();
                current_team_text = game.add.text(300, 250, "omg this is some text");
                suprise_text      = game.add.text(200,  670, "", game_info.surprise_card_text_box_style);
                timer             = game.time.events.add(Phaser.Timer.MINUTE * turn_length, this);
                timer_text        = game.add.text(400,  570, "");

                

                popup_group.add(popup_background);
                popup_group.add(roll_button);


                logo.scale.setTo(0.3,0.3);
                board.anchor.setTo(0.5, 0.5);

                // Create the correct number of piece controllers
                for(var i = 0; i < number_teams; i++){
                        piece_controlers.push(new Piece_controler());
                }

                for(var i = 0; i < number_teams; i++){
                        current_piece_x     = 'piece_'+ (i+1) + '_x';
                        current_piece_y     = 'piece_'+ (i+1) + '_y';
                        current_piece_image = 'piece_'+ (i+1) + '_image';  
                        pieces[i] = game.add.sprite(game_info.board_tiles[piece_controlers[i].current_tile][current_piece_x], game_info.board_tiles[piece_controlers[i].current_tile][current_piece_y], current_piece_image);                        
                }     


                // We need to reset these variables so that they are correctly initialized for update
                current_piece_x = 'piece_'+ 1 + '_x';
                current_piece_y = 'piece_'+ 1 + '_y';
                update_popup();
        },

        update: function  () {
                if(first_turn_taken == 1){
                        var time_string       = format_time(game.time.events.duration);
                        timer_text.setText("Time Left: " + time_string);        
                }
                
        }
}
