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

var tables = [];
var iTableNumber = 0;

var button = null;

/* Globals Begin */



/* Class-hand Begin */

function hand(seatNumber, playerName, stacksize, $tableDiv)
{
	this.seatNumber = seatNumber;
	this.playerName = playerName;
	this.stack = parseInt(stacksize);
	this.position = null;
	
	this.$handDiv = $('<div class="hand"></div>').appendTo($tableDiv);
	
	this.$seatElem = $('<label class="handElem seatElem"></label>').appendTo(this.$handDiv);
	this.$seatElem.html(this.seatNumber);
	
	this.$nameElem = $('<input type="text" class="handElem nameElem" />').appendTo(this.$handDiv);
	this.$nameElem.val(this.playerName);
	this.$nameElem.on('change', {me: this}, this.changeName);
	
	this.$stackElem = $('<input type="text" class="handElem stackElem" />').appendTo(this.$handDiv);
	this.$stackElem.prop('disabled', true);
	
	this.$positionElem = $('<label class="handElem positionElem"></label>').appendTo(this.$handDiv);
	
	this.$actionElem1 = $('<input type="button" class="handElem actionElem1" />').appendTo(this.$handDiv);
	this.$actionElem1.hide();
	
	this.$actionElem2 = $('<input type="button" class="handElem actionElem2" />').appendTo(this.$handDiv);
	this.$actionElem2.hide();
	
	this.updateStack();	
}

hand.prototype.deconstruct = function()
{
	delete this.seatNumber;
	delete this.playerName;
	delete this.stack;
	delete this.position;
	this.$nameElem.unbind('change');
	this.$handDiv.remove();
	delete this.$seatElem;
	delete this.$nameElem;
	delete this.$stackElem;
	delete this.$positionElem;
	delete this.$actionElem1;
	delete this.$actionElem2;
	delete this.$handDiv;
}

hand.prototype.changeName = function(event)
{
	event.data.me.playerName = event.data.me.$nameElem.val();
	console.log(event.data.me);
}

hand.prototype.updateStack = function()
{
	this.$stackElem.val(this.stack);
}


hand.prototype.buyin = function(event)
{
	amount = parseInt(prompt('buy-in amount'));
	event.data.me.stack += amount;
	event.data.me.updateStack();	
}

hand.prototype.buyinShow = function()
{
	this.$actionElem1.val('buy-in');
	this.$actionElem1.on('click', {me: this}, this.buyin);
	this.$actionElem1.show();
}

hand.prototype.buyinHide = function()
{
	this.$actionElem1.unbind('click');
	this.$actionElem1.hide();
}
hand.prototype.assignPosition = function(index, label)
{
	this.position = index;
	this.$positionElem.html(label);
}

/* Class-hand End */



/* Class-table Begin */

function table($putHere, tableNumber)
{
	this.tableNumber = tableNumber;
	this.hands = [];
	
	this.$tableDiv = $('<div class="table"></div>').appendTo($putHere);
	
	this.$seatNumberInput = $('<input type="text" class="tableInput seatNumber" />').appendTo(this.$tableDiv);
	this.$seatNumberInput.val(1);
	
	this.$playerNameInput = $('<input type="text" class="tableInput playerName" />').appendTo(this.$tableDiv);
	
	this.$stackSizeInput = $('<input type="text" class="tableInput stackSize" />').appendTo(this.$tableDiv);
	this.$stackSizeInput.val(10000);
	
	this.$addHandbtn = $('<button class="tableInput addHand">+1</button>').appendTo(this.$tableDiv);
	this.$addHandbtn.on('click', {me: this}, this.addHand);
	
	this.$lottoButton = $('<button class="tableInput btnLotto">btn lotto</button>').appendTo(this.$tableDiv);
	this.$lottoButton.on('click', {me: this}, this.btnLotto);
	
	this.$handsDiv = $('<div class="hands"></div>').appendTo(this.$tableDiv);
}

table.prototype.deconstruct = function()
{
	delete this.tableNumber;
	for(h in this.hands)
	{
		this.hands[h].deconstruct();
	}
	delete this.hands;
	this.$addHandbtn.unbind('click');
	this.$lottoButton.unbind('click');
	this.$tableDiv.remove();
	delete this.$seatNumberInput;
	delete this.$playerNameInput;
	delete this.$stackSizeInput;
	delete this.$addHandbtn;
	delete this.$lottoButton;
	delete this.$handsDiv;
	delete this.$tableDiv;
	tables.splice(tables.indexOf(this), 1);
	delete this;
}

table.prototype.addHand = function(event)
{
	self = event.data.me;
	if(self.hands.length >= 9)
	{
		alert('too many players');
		return;
	}
	makenumbr = true;
	for(h in self.hands)
	{
		if(self.$seatNumberInput.val() == self.hands[h].seatNumber) makenumbr = false;
	}
	if(!makenumbr)
	{
		alert('seat taken');
		return;
	}
	
	self.hands.push(new hand(self.$seatNumberInput.val(), self.$playerNameInput.val(), self.$stackSizeInput.val(), self.$handsDiv));
	self.resetInputs();
	
	if(!self.$tableDiv.find('.btnLotto:first').is(':visible')) self.updatePositions();
}

table.prototype.resetInputs = function()
{
	i = 0;
	while(i++ < 9)
	{
		makenumbr = true;
		for(h in this.hands)
		{
			if(i == this.hands[h].seatNumber) makenumbr = false;			
		}
		if(makenumbr)
		{
			this.$seatNumberInput.val(i);
			break;
		}
		else this.$seatNumberInput.val('');
	}
	this.$playerNameInput.val('');
}

table.prototype.updatePositions = function()
{
	i = 0;
	for(h in this.hands)
	{
		position = (button+i)%this.hands.length;
		if(position+1 == this.hands.length && this.hands.length > 4) position = positions.length-1;
		else if(position+2 == this.hands.length && this.hands.length > 5) position = positions.length-2;
		else if(position+3 == this.hands.length && this.hands.length > 6) position = positions.length-3;
		i++;
		this.hands[h].assignPosition(position, positions[position]);
	}
}

table.prototype.btnLotto = function(event){
	button = Math.floor(Math.random() * event.data.me.hands.length);
	event.data.me.updatePositions();
	event.data.me.$lottoButton.hide();
}

table.prototype.startHand = function()
{
	this.$addHandbtn.hide();
	for(h in this.hands)
	{
		this.hands[h].buyinHide();
	}
}

table.prototype.endHand = function()
{
	this.$addHandbtn.show();
	for(h in this.hands)
	{
		this.hands[h].buyinShow();
	}
}

/* Class-table End */