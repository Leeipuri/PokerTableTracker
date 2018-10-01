/* Class-table Begin */

function table(tournament, tableNumber)
{
	this.tournament = tournament;
	this.tableNumber = tableNumber;
	this.seats = [];
	this.button = null;
	this.bettingRound = -1;
	this.pot = 0;
	this.actionSeat = null;
	this.bigblind = null;
	this.smallblind = null;
	this.ante = null;
	
	this.$tableDiv = $('<div class="table"></div>').appendTo(this.tournament.$tournamentDiv);
	
	this.$tableLabel = $('<label class="tableElem tableLabel"></label>').appendTo(this.$tableDiv).html('table'+this.tableNumber);
	
	this.$bettingRoundLabel = $('<label class="tableElem bettingRoundLabel"></label>').appendTo(this.$tableDiv);
	
	this.$actionButton = $('<input type="button" class="tableElem actionButton" />').appendTo(this.$tableDiv);
	
	this.$blindsInput = $('<input type="text" class="tableElem blindsInput" />').appendTo(this.$tableDiv).on('change', {me: this}, this.handleBlindsSet);
	
	// tables have 9 seats
	while(this.seats.length < 9)
	{
		iSeat = this.seats.length+1;
		this.seats.push(new seat(this, iSeat));
	}
	
	return this.clearActionButton().setBlinds(100).bindActionButton(this.seatLotto, UItexts.seatLotto);
}

table.prototype.deconstruct = function()
{
	delete this.tableNumber;
	for(s in this.seats)
	{
		this.seats[s].deconstruct();
	}
	delete this.seats;
	this.clearActionButton().$tableDiv.remove();
	delete this.$actionButton;
	delete this.$tableDiv;
	this.tournament.tables.splice(this.tournament.tables.indexOf(this), 1);
	delete this;
	
	return true;
}

table.prototype.setBlinds = function(bigblind)
{
	this.bigblind = parseInt(bigblind);
	this.smallblind = this.bigblind/2;
	this.ante = this.bigblind/10;
	this.$blindsInput.val(this.ante+'/'+this.bigblind/2+'/'+this.bigblind)
	return this;
}

table.prototype.handleBlindsSet = function(event)
{
	self = event.data.me;
	return self.setBlinds(self.$blindsInput.val());
}

table.prototype.bindActionButton = function(action, buttonText)
{
	this.$actionButton.on('click', {me: this}, action).val(buttonText).show();
	return this;
}

table.prototype.clearActionButton = function()
{
	this.$actionButton.hide().unbind('click').val(UItexts.textEmpty);
	return this;
}

table.prototype.getSeatsOccupied = function()
{
	tPlayers = [];
	for(s in this.seats)
	{
		if(this.seats[s].player != null && this.seats[s].player.stack > 0) tPlayers.push(s);
	}
	return tPlayers;
}

table.prototype.getPlayersInQueue = function()
{
	qPlayers = [];
	for(p in this.tournament.players)
	{
		if(this.tournament.players[p].seat == null && this.tournament.players[p].stack > 0) qPlayers.push(parseInt(p));
	}
	return qPlayers;
}

table.prototype.seatLotto = function(event){
	self = event.data.me;
	queue = self.getPlayersInQueue();
	for(q in queue)
	{
		if(self.getSeatsOccupied().length >= self.seats.length) break;
		p = queue[q];
		if(self.tournament.players[p].seat != null) continue;	
		do{
			iSeat = Math.floor(Math.random() * self.seats.length);
		}while(self.seats[iSeat].player != null);
		s = self.seats[iSeat];
		self.seats[iSeat].playerEnterSeat({data:{me: self.seats[iSeat], player: p}}).updateStack();
	}
	return self;
}

table.prototype.buttonLotto = function(event){
	self = event.data.me;
	if(self.getSeatsOccupied().length < 2) return;
	do{
		self.button = Math.floor(Math.random() * self.seats.length);
	}while(self.seats[self.button].player == null);
	return self.updatePositions().clearActionButton().bindActionButton(self.startHand, UItexts.startHand);
}

table.prototype.updatePositions = function()
{
	i = 0;
	tPlayers = this.getSeatsOccupied();
	iButton = tPlayers.indexOf(String(this.button));
	for(a in tPlayers)
	{
		position = (tPlayers.length+i-iButton)%tPlayers.length;
		if(tPlayers.length == 2 && position == 1) position = 2;
		else if(position+1 == tPlayers.length && tPlayers.length > 4) position = positions.length-1;
		else if(position+2 == tPlayers.length && tPlayers.length > 5) position = positions.length-2;
		else if(position+3 == tPlayers.length && tPlayers.length > 6) position = positions.length-3;
		i++;
		this.seats[tPlayers[a]].setPosition(position, positions[position]);
	}
	return this;
}

table.prototype.startHand = function(event)
{
	self = event.data.me;
	tPlayers = self.getSeatsOccupied();
	for(s in self.seats)
	{
		self.seats[s].clearActionButtons().checkPlayerStack();
	}
	return self.updateBettingRound().updatePositions().setActionSeat((tPlayers.indexOf(String(self.button))+3)%tPlayers.length).clearActionButton().bindActionButton(self.incrementBettingRound, UItexts.endBetting);
}

table.prototype.endHand = function(event)
{
	self = event.data.me;
	self.bettingRound = -1;
	self.$bettingRoundLabel.empty();
	do{
		self.button = (self.button+1)%self.seats.length;
	}while(self.seats[self.button].player.stack <= 0);
	self.updatePositions();
	for(s in self.seats)
	{
		if(self.seats[s].player == null) continue;
		self.seats[s].clearActionButtons().bindActionButton1(self.seats[s].player.buyin, UItexts.buyin);
	}
	return self.clearActionButton().bindActionButton(self.startHand, UItexts.startHand);
}

table.prototype.updateBettingRound = function()
{
	this.bettingRound++;
	this.$bettingRoundLabel.html(bettingRounds[this.bettingRound]);
	for(s in this.seats)
	{
		if(this.seats[s].player == null) continue;
		this.pot += this.seats[s].clearActionButtons().bettingOver();
	}
	return this;
}

table.prototype.incrementBettingRound = function(event)
{
	tPlayers = self.getSeatsOccupied();
	self.setActionSeat((tPlayers.indexOf(String(self.button))+1)%tPlayers.length);
	
	if(self.bettingRound < 3) return;
	self.clearActionButton();
	return self.clearActionButton().bindActionButton(self.endHand, UItexts.endHand);
}

table.prototype.setActionSeat = function(seatIndex)
{
	self.updateBettingRound();
	tPlayers = self.getSeatsOccupied();
	if(tPlayers.length == 2) self.actionSeat = self.button;
	else self.actionSeat = tPlayers[seatIndex];
	self.seats[self.actionSeat].handleAction(this.bigblind);
	return self;
}

/* Class-table End */