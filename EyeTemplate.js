const EyeTemplate = s =>
    class Eye {
        constructor(xRadius, nodeAmount, x, y, pupilRad, isClosable = true) {
            this.xPos1 = - xRadius + x;
            this.yPos1 = y;
            this.xNode1 =  - nodeAmount + x;
            this.yNode1 = - nodeAmount + y;
            
            this._yNode1 = nodeAmount + y;
            
            this.xNode2 = nodeAmount + x;
            this.yNode2 = - nodeAmount + y;

            this._yNode2 = nodeAmount + y;

            this.xPos2 = xRadius + x;
            this.yPos2 = y;
            
            this.RGB = [255, 255, 255];
            this.nodeAmount = nodeAmount;
            this.yPosOffset = y;
            this.eyexRadius = xRadius;
            this.eyeState = 0;
            this.blinkSpeed = 4;
            this.blinkMaxTime = s.random(300, 800);
            this.timer = 0;
            this.isClosable = isClosable;

            // pupil
            this.pupilRad = pupilRad;
            this.xPosEllipse = (this.xPos1 + this.xPos2)/2;
            this.yPosEllipse = (this.yPos2 + this.yPos1)/2;
            this.eyeMovementX = 0;
            this.eyeMovementY = 0;
            this.closingEye = false;
        }

        display() {
            for (let i = 0; i < 3; i++)
                if (this.RGB[i] < 255) this.RGB[i] = this.RGB[i] + 1;

            this.eyeMovementX = s.random(0, 3);
            if (this.timer < this.blinkMaxTime) this.timer++;
            else {
                this.blinkMaxTime = s.random(300, 800);
                this.blink();
                this.timer = 0;
            }

            s.fill(this.RGB[0], this.RGB[1], this.RGB[2]);
            s.bezier(this.xPos1, this.yPos1, this.xNode1, this.yNode1, this.xNode2, this.yNode2, this.xPos2, this.yPos2);
            s.bezier(this.xPos1, this.yPos1 - 1, this.xNode1, this._yNode1, this.xNode2, this._yNode2, this.xPos2, this.yPos2 - 1);

            s.fill(0);
            s.ellipse(this.xPosEllipse + this.eyeMovementX, this.yPosEllipse + this.eyeMovementY, this.pupilRad);

            if (this.isClosable)
                if (s.mouseX > this.xPos1 && s.mouseX < this.xPos2 && s.mouseY > this.yPos1 - this.nodeAmount && s.mouseY < this.yPos1 + this.nodeAmount)
                    this.closeEye();
                else this.openEye();

            if (s.mouseX > this.xPosEllipse && this.xPosEllipse + this.nodeAmount*2/3 < this.xPos2) this.xPosEllipse += 10;
            if (s.mouseX < this.xPosEllipse && this.xPosEllipse - this.nodeAmount*2/3 > this.xPos1) this.xPosEllipse -= 10;
            if (s.mouseY > this.yPosEllipse && this.yPosEllipse + this.nodeAmount*2/3 < this.yPos1 + this.nodeAmount) this.yPosEllipse += 10;
            if (s.mouseY < this.yPosEllipse && this.yPosEllipse - this.nodeAmount*2/3 > this.yPos1 - this.nodeAmount) this.yPosEllipse -= 10;

            if (this.eyeState == -1) {
                let flag = true;
                if (this.yNode1 < this.yPosOffset) {
                    this.yNode1 += this.blinkSpeed;
                    flag = false;
                }
                if (this.yNode2 < this.yPosOffset) {
                    this.yNode2 += this.blinkSpeed;
                    flag = false;
                }
                if (this._yNode1 > this.yPosOffset) {
                    this._yNode1 -= this.blinkSpeed;
                    flag = false;
                }
                if (this._yNode2 > this.yPosOffset) {
                    this._yNode2 -= this.blinkSpeed;
                    flag = false;
                }
                if (flag) this.eyeState = 1;
            }
            if (this.eyeState == 1) {
                let flag = true;
                if (this.yNode1 >- this.nodeAmount + this.yPosOffset) {
                    this.yNode1 -= this.blinkSpeed;
                    flag = false;
                } 
                if (this.yNode2 > - this.nodeAmount + this.yPosOffset) {
                    this.yNode2 -= this.blinkSpeed;
                    flag = false;
                } 
                if (this._yNode1 < + this.nodeAmount + this.yPosOffset) {
                    this._yNode1 += this.blinkSpeed;
                    flag = false;
                }
                if (this._yNode2 < + this.nodeAmount + this.yPosOffset) {
                    this._yNode2 += this.blinkSpeed;
                    flag = false;
                } 
                if (flag && !this.closingEye) this.eyeState = 0;
            }
        }

        closeEye() {
            this.eyeState = -1;
            this.closingEye = true;
        }

        openEye() {
            this.eyeMovementX = 0;
            this.eyeMovementY = 0
            this.closingEye = false;
        }

        blink() {
            this.eyeState = -1;
        }

        mutate() {
            this.RGB = [Math.floor(s.random(255)), Math.floor(s.random(255)), Math.floor(s.random(255))];
        }
    }