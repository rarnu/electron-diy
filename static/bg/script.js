function getRandomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let space = document.getElementById("space"),
    spaceWidth = space.scrollWidth,
    spaceHeight = space.scrollHeight,
    perspective = 100

space.style.setProperty(`--perspective`, `${perspective}px`)

function makeStar() {
  const star = document.createElement(`time`),
        starWidth = getRandomRange(1, 1.5),
        starHeight = starWidth * getRandomRange(20, 40),
        randomRotation = Math.random() * 360,
        scaleModifier = Math.random()
  
  const visibleRangeMaximum = spaceWidth - spaceHeight > 0 ? spaceWidth / 2 : spaceHeight / 2

  TweenMax.set(star, {
    width: `${starWidth}px`,
    height: `${starHeight}px`,
    transform: `
      translateY(${starHeight / 2}px)
      rotate(${randomRotation}deg)
      rotateX(90deg)
      translate3d(0,0,0px)
      scaleX(${scaleModifier})
    `,
  });
  
  TweenMax.to(star, getRandomRange(5, 20), {
    transform: `
      translateY(${starHeight / 2}px)
      rotate(${randomRotation}deg)
      rotateX(90deg)
      translate3d(0,0,${perspective + visibleRangeMaximum}px)
      scaleX(${scaleModifier})
    `,
    repeat: -1,
    ease: Power0.easeNone,
  }).progress( Math.random() );
  
  space.appendChild(star)
}

for (let i = 0; i < 200; i++) {
   makeStar();
}