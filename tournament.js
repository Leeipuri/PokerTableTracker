/* Globals Begin */

var positions = [
	'BTN',
	'SB',
	'BB',
	'UTG',
	'UTG+1',
	'UTG+2',
	'LJ',
	'HJ',
	'CO'
];

var bettingRounds = [
	'preflop',
	'flop',
	'turn',
	'river'
];

var actions = [
	'on',
	'check',
	'call',
	'bet',
	'raise',
	'allin',
	'fold'
];

var UItexts = {
	addPlayer: 'add player',
	seatLotto: 'seat lotto',
	buttonLotto: 'button lotto',
	startHand: 'startHand',
	endBetting: 'end betting round',
	endHand: 'end hand',
	addPlayer: 'add player',
	check: 'check',
	call: 'call',
	bet: 'bet',
	raise: 'raise',
	fold: 'rold',
	allIn: 'all in',
	buyin: 'buyin',
	textEmpty: ''
};

var tournaments = [];

/* Globals End */



/* Class-tournament Begin */

function tournament($putHere, tournamentTitle, numberOfTables)
{
	this.tournamentTitle = tournamentTitle;
	this.tables = [];
	this.players = [];
	this.iTableNumber = 0;
	
	this.$tournamentDiv = $('<div class="tournament"></div>').appendTo($putHere);
	
	this.$tournamentLabel = $('<label class="tournamentElem tournamentLabel"></label>').appendTo(this.$tournamentDiv).html(this.tournamentTitle);
	
	this.$playerNameInput = $('<input type="text" class="tournamentElem playerName" />').appendTo(this.$tournamentDiv);
	
	this.$stackSizeInput = $('<input type="text" class="tournamentElem stackSize" />').appendTo(this.$tournamentDiv).val(10000);
	
	this.$actionButton = $('<input type="button" class="tournamentElem actionButton" />').appendTo(this.$tournamentDiv).on('click', {me: this}, this.addPlayer).val('add player');
	
	while(this.tables.length < numberOfTables)
	{
		this.iTableNumber++;
		this.tables.push(new table(this, this.iTableNumber));
	}
	
	return this;
}

tournament.prototype.deconstruct = function()
{
	delete this.tournamentTitle;
	for(t in this.tables)
	{
		this.tables[t].deconstruct();
	}
	delete this.tables;
	for(p in this.players)
	{
		this.players[p].deconstruct();
	}
	delete this.players;
	delete this.$seatNumberInput;
	delete this.$playerNameInput;
	delete this.$stackSizeInput;
	
	return true;	
}

tournament.prototype.clearActionButton = function()
{
	this.$actionButton.hide().unbind('click').val(UItexts.textEmpty);
	return this;
}

tournament.prototype.addPlayer = function(event)
{
	self = event.data.me;
	if(self.$playerNameInput.val() == '') playerName = makeid();
	else playerName = self.$playerNameInput.val();
	newPlayer = new player(playerName, self.$stackSizeInput.val());
	self.players.push(newPlayer);
	
	//test players
	if(self.players.length < 12) self.addPlayer(event);
	
	return self;
}

// function makes test player names
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/* Class-tournament End */