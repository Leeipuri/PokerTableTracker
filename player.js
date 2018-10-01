/* Class-player Begin */

function player(playerName, stacksize)
{
	this.playerName = null;
	this.stack = null;
	this.seat = null;
	
	this.setPlayerName(playerName).setStack(stacksize);
	
	return this;
}

player.prototype.deconstruct = function()
{
	delete this.playerName;
	delete this.stack;
	this.seat = null;
	delete this.seat;
	return true;
}

player.prototype.setPlayerName = function(playerName)
{
	this.playerName = playerName;
	return this;
}

player.prototype.setStack = function(stack)
{
	this.stack = parseInt(stack);
	return this;
}

player.prototype.setSeat = function(seat)
{
	this.seat = seat;
	return this;
}

player.prototype.handleStack = function(handleAmount)
{
	this.stack += parseInt(handleAmount);
	return this;
}

player.prototype.win = function(winAmount)
{
	if(betAmount < 0) return;
	return this.handleStack(Math.abs(winAmount));
}

player.prototype.bet = function(betAmount)
{
	if(betAmount < 0) return;
	if(betAmount > this.stack) betAmount = this.stack;
	this.handleStack(-Math.abs(betAmount));
	return betAmount;
}

player.prototype.buyin = function(event)
{
	self = event.data.me.player;
	selfSeat = event.data.me;
	amount = parseInt(prompt('buy-in amount'));
	if(betAmount < 0) return;
	self.handleStack(amount);
	if(selfSeat == null) return;
	selfSeat.updateStack();
	return self;
}

player.prototype.cashout = function(event)
{
	self = event.data.me;
	self.setStack(0).seat.updateStack();
	return self;
}

player.prototype.bust = function(event)
{
	playerSelf = event.data.me;
	playerSelf.setStack(0).seat.setPosition(-1, 'busted').updateStack();	
	return playerSelf;
}

/* Class-player End */