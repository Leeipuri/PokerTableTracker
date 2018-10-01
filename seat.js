/* Class-seat Begin */

function seat(table, seatNumber)
{
	this.table = null;
	this.seatNumber = null;
	this.player = null;
	this.position = null;
	this.action = null;
	this.betAmount = null;
	
	this.setTable(table).setSeatNumber(seatNumber);
	
	this.$seatDiv = $('<div class="seat"></div>').appendTo(this.table.$tableDiv);
	
	this.$seatLabel = $('<label class="seatElem seatLabel"></label>').appendTo(this.$seatDiv).html('#'+this.seatNumber);
	
	this.$playerSelectInput = $('<select class="seatElem playerSelectInput"></select>').appendTo(this.$seatDiv).on('click', {me: this}, this.populatePlayerSelect).on('change', {me: this}, this.playerEnterSeat);
	
	this.$playerNameInput = $('<input type="text" class="seatElem playerNameInput" />').appendTo(this.$seatDiv).on('change', {me: this}, this.playerSetName).hide();
	
	this.$stackInput = $('<input type="text" class="seatElem stackInput" />').appendTo(this.$seatDiv).prop('disabled', true);
	
	this.$positionLabel = $('<label class="seatElem positionLabel"></label>').appendTo(this.$seatDiv);
	
	this.$betAmountLabel = $('<label class="seatElem betAmountLabel"></label>').appendTo(this.$seatDiv);
	
	this.$actionButton1 = $('<input type="button" class="seatElem actionButton1" />').appendTo(this.$seatDiv).hide();
	
	this.$actionButton2 = $('<input type="button" class="seatElem actionButton2" />').appendTo(this.$seatDiv).hide();
	
	this.$actionButton3 = $('<input type="button" class="seatElem actionButton3" />').appendTo(this.$seatDiv).hide();
	
	return this.updateStack();
}

seat.prototype.deconstruct = function()
{
	delete this.seatNumber;
	this.player = null;
	delete this.player;
	delete this.position;
	this.$playerNameInput.unbind('change');
	this.$seatDiv.remove();
	delete this.$seatLabel;
	delete this.$playerSelectInput;
	delete this.$playerNameInput;
	delete this.$stackInput;
	delete this.$positionLabel;
	delete this.$actionButton1;
	delete this.$actionButton2;
	delete this.$seatDiv;
	
	return true;
}

seat.prototype.bindActionButton1 = function(action, buttonText)
{
	this.$actionButton1.on('click', {me: this}, action).val(buttonText).show();
	return this;
}

seat.prototype.bindActionButton2 = function(action, buttonText)
{
	this.$actionButton2.on('click', {me: this}, action).val(buttonText).show();
	return this;
}

seat.prototype.bindActionButton3 = function(action, buttonText)
{
	this.$actionButton3.on('click', {me: this}, action).val(buttonText).show();
	return this;
}

seat.prototype.clearActionButton1 = function()
{
	this.$actionButton1.hide().unbind('click').val(UItexts.textEmpty);
	return this;
}

seat.prototype.clearActionButton2 = function()
{
	this.$actionButton2.hide().unbind('click').val(UItexts.textEmpty);
	return this;
}

seat.prototype.clearActionButton3 = function()
{
	this.$actionButton2.hide().unbind('click').val(UItexts.textEmpty);
	return this;
}

seat.prototype.clearActionButtons = function()
{
	this.$actionButton1.hide().unbind('click').val(UItexts.textEmpty);
	this.$actionButton2.hide().unbind('click').val(UItexts.textEmpty);
	this.$actionButton3.hide().unbind('click').val(UItexts.textEmpty);
	return this;
}

seat.prototype.setTable = function(table)
{
	this.table = table;
	return this;
}

seat.prototype.setSeatNumber = function(seatNumber)
{
	this.seatNumber = seatNumber;
	return this;
}

seat.prototype.setPlayer = function(player)
{
	this.player = player;
	return this;
}

seat.prototype.setPosition = function(index, position)
{
	this.position = index;
	this.$positionLabel.html(position);
	return this;
}

seat.prototype.setAction = function(action)
{
	this.action = action;
	return this;
}

seat.prototype.setBet = function(betAmount)
{
	this.betAmount = betAmount;
	return this;
}

seat.prototype.updateStack = function()
{
	if(this.player == null)
	{
		this.$playerNameInput.hide();
		this.$playerSelectInput.empty().show();
	}
	else
	{
		this.$playerSelectInput.hide();
		this.$playerNameInput.val(this.player.playerName).show();
		this.$stackInput.val(this.player.stack);
	}
	return this;
}

seat.prototype.playerSetName = function(event)
{
	self = event.data.me;
	if(self.player == null) self.$playerNameInput.val('')
	else self.player.setPlayerName(self.$playerNameInput.val());
	return self;
}

seat.prototype.populatePlayerSelect = function(event)
{
	self = event.data.me;
	players = self.table.tournament.players;
	self.$playerSelectInput.html('<option></option>');
	for(p in players)
	{
		if(players[p].seat != null) continue;
		self.$playerSelectInput.append('<option value="'+p+'">'+players[p].playerName+'</option>');
	}
	return self;
}

seat.prototype.playerEnterSeat = function(event)
{
	seatSelf = event.data.me;
	if(seatSelf.player != null) return;
	if(typeof event.data.player == 'undefined') p = seatSelf.$playerSelectInput.val();
	else p = event.data.player;
	seatSelf.setPlayer(seatSelf.table.tournament.players[p]).updateStack().player.setSeat(seatSelf);
	seatTable = seatSelf.table;
	if(seatTable.getSeatsOccupied().length >= seatTable.seats.length && seatTable.button == null) seatTable.clearActionButton().bindActionButton(seatTable.buttonLotto, UItexts.buttonLotto);
	return seatSelf;
}

seat.prototype.playerLeaveSeat = function(player)
{
	this.player.setSeat(null);
	return this.setPlayer(null).updateStack();
}

seat.prototype.checkPlayerStack = function()
{
	if(this.player.stack <= 0) this.player.bust({data:{me: this.player}});
	// blinds and antes handle
	return this;
}

seat.prototype.playerMakesBet = function(betAmount)
{
	if(betAmount < 0) return;
	this.betAmount += this.player.bet(betAmount);
	return this;
}

seat.prototype.bettingOver = function()
{
	// return this.clearActionButtons().setBet(this.table.ante);
}

seat.prototype.fold = function()
{
	return this.setAction(actions.indexOf('fold'));
}

seat.prototype.check = function()
{
	return this.setAction(actions.indexOf('check'));
}

seat.prototype.call = function()
{
	return this.setAction(actions.indexOf('call'));
}

seat.prototype.bet = function()
{
	return this.setAction(actions.indexOf('bet'));
}

seat.prototype.raise = function()
{
	return this.setAction(actions.indexOf('raise'));
}

seat.prototype.allin = function()
{
	return this.setAction(actions.indexOf('allin'));
}

seat.prototype.handleAction = function(currentBet)
{
	this.setAction(0).bindActionButton3(this.fold, UItexts.fold);
	if(currentBet == this.betAmount) this.bindActionButton1(this.check, UItexts.check);
	if(this.player.stack <= (currentBet - this.betAmount))
	{
		this.bindActionButton1(this.allin, UItexts.allIn);
		this.bindActionButton2(this.allin, UItexts.allIn);
	}
	else
	{
		this.bindActionButton1(this.call, UItexts.fold);
		if(currentBet == 0) this.bindActionButton2(this.bet, UItexts.bet);
		else this.bindActionButton2(this.raise, UItexts.raise);
	}
	return this;
}

/* Class-seat End */