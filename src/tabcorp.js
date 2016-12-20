
   var Tabcorp = function (data) {
        
        if (!data || !(data instanceof Array)) 
            throw new Error('invalidate params');
        this._winList = _generateRandomResult().split(',');
        this._arrData = data;
        this._arrObj = {
            winArr: [],
            placeArr: []
        };
        _generateArr(this);
    };

    
    var _generateRandomResult = function () {
        return Array.apply(0, Array(3)).map(function () {
            return (function (charset) {
                return charset.charAt(Math.floor(Math.random() * charset.length))
            }('123456789'));
        }).join(',');
    };

    
    var _generateArr = function (_this) {
        for (var i = 0, len = _this._arrData.length; i < len; i++) {
            var tpArr = _this._arrData[i].split(':');
            var tpProduct = tpArr[1];
            var tpArrEle2 = tpArr[2];            
            var tpStake = tpArr[3];
            //element in each produce array is an obj like this format
            var obj = {'product': tpProduct, 'selection': tpArrEle2, 'stake': tpStake};
            if (tpProduct === 'W') {
                _this._arrObj.winArr.push(obj);
            } else if (tpProduct === 'P') {
                _this._arrObj.placeArr.push(obj);
            } else {
               //should not happen
               throw new Error('invalidate params');
            }
        }
    };

   
    Tabcorp.prototype.generateWin = function () {
        var winNo1 = this._winList[0];
        var _winArr = this._arrObj.winArr;
        //W
        var winStake = 0,       // all punters stake
            winStakeEnd = 0;    //all stake between last winner punters

        for (var i = 0, len = _winArr.length; i < len; i++) {
            winStake += _winArr[i].stake * 1; //convert to digital
            if (_winArr[i].selection == winNo1) {
                winStakeEnd += _winArr[i].stake * 1;
            }
        }
        var remainStake = winStake - winStake * 0.15;
       
        var winYields = winStakeEnd ? (remainStake / winStakeEnd).toFixed(2) : (remainStake / _winArr.length).toFixed(2);

        var callback = Array.prototype.slice.apply(arguments)[0];
        var rtnData = 'Win:' + winNo1 + ':$' + winYields;
        if(callback){
            return callback(rtnData);
        }
        return rtnData;
    };

    
    Tabcorp.prototype.generatePlace = function () {
        var _placeArr = this._arrObj.placeArr;
        var placeStake = 0,         //all punters stake
            placeFirstStake = 0,    //the total stake who choose no1
            placeSecondStake = 0,   //the total stake who choose no2
            placeThirdStake = 0;    //the total stake who choose no3
        for (var i = 0, len = _placeArr.length; i < len; i++) {
            var tpEle = _placeArr[i];
            placeStake += tpEle.stake * 1;
            if (tpEle.selection == this._winList[0]) {
                placeFirstStake += tpEle.stake * 1;
            }
            if (tpEle.selection == this._winList[1]) {
                placeSecondStake += tpEle.stake * 1;
            }
            if (tpEle.selection == this._winList[2]) {
                placeThirdStake += tpEle.stake * 1;
            }
        }
        var remainStake = ((placeStake - placeStake * 0.12) / 3).toFixed(2);
        //if no punters win set the each yields = remainStake/_placeArr.length
        var noWinnerDividends = (remainStake / _placeArr.length).toFixed(2);
        var pYields1 = placeFirstStake ? (remainStake / placeFirstStake).toFixed(2) : noWinnerDividends;
        var pYields2 = placeSecondStake ? (remainStake / placeSecondStake).toFixed(2) : noWinnerDividends;
        var pYields3 = placeThirdStake ? (remainStake / placeThirdStake).toFixed(2) : noWinnerDividends;

        var callback = Array.prototype.slice.apply(arguments)[0];
        var rtnData = [
            'Place:' + this._winList[0] + ':$' + pYields1,
            'Place:' + this._winList[1] + ':$' + pYields2,
            'Place:' + this._winList[2] + ':$' + pYields3
        ];
        if(callback){
            return callback(rtnData);
        }
        return rtnData;
    };

    module.exports = Tabcorp;
    
 
