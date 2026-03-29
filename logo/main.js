let allTeams=[]
let gameTeams=[]
let current=0
let score=0
let mistakes=0
let maxMistakes=1
let total=10
let timer
let timeLeft=15
let activeConfetti=0

let selectedLeagues=[]
let difficulty=1
let bonusEnabled=true
let roundTime=15

const slider=document.getElementById("logoSlider")
const logoCount=document.getElementById("logoCount")
const logoInput=document.getElementById("logoInput")

slider.oninput=()=>{
logoCount.innerText=slider.value
logoInput.value=slider.value
}

logoInput.oninput=()=>{
let val=Math.max(5,Math.min(100,logoInput.value))
slider.value=val
logoCount.innerText=val
}

function shuffle(arr){
return arr.sort(()=>Math.random()-0.5)
}

function toggleLeague(league,el){
if(selectedLeagues.includes(league)){
selectedLeagues=selectedLeagues.filter(l=>l!==league)
el.classList.remove("active")
}else{
selectedLeagues.push(league)
el.classList.add("active")
}
}

function buildTeams(){
allTeams=[]
if(selectedLeagues.includes("premier")) allTeams.push(...premierLeague)
if(selectedLeagues.includes("laliga")) allTeams.push(...laliga)
if(selectedLeagues.includes("bundesliga")) allTeams.push(...bundesliga)
if(selectedLeagues.includes("ligue1")) allTeams.push(...ligue1)
}

function setDifficulty(level){
difficulty=level
closeDifficulty()
startGame()
}

function startSelectionGame(){
if(selectedLeagues.length===0){
alert("Select at least one league!")
return
}
buildTeams()
startGame()
}

function startRandom(){
allTeams=[...premierLeague,...laliga,...bundesliga,...ligue1]
startGame()
}

function showLoading(){
document.getElementById("loadingScreen").classList.remove("hidden")
}

function startGame(){

total=parseInt(slider.value)

if(allTeams.length<total){
alert("Not enough clubs for "+total+" logos.")
return
}

roundTime=parseInt(document.getElementById("timeSelect").value)
bonusEnabled=document.getElementById("bonusToggle").value==="yes"

showLoading()

setTimeout(()=>{

gameTeams=shuffle([...allTeams]).slice(0,total)

document.getElementById("home").classList.add("hidden")
document.getElementById("game").classList.remove("hidden")
document.getElementById("loadingScreen").classList.add("hidden")

current=0
score=0

nextRound()

},300)

}

function nextRound(){

mistakes=0

let input=document.getElementById("guessInput")
input.value=""
document.getElementById("message").innerText=""

let team=gameTeams[current]
let logo=document.getElementById("logo")

logo.src=team.hidden

let blurEnabled=document.getElementById("blurToggle").value==="yes"
logo.className=blurEnabled?"blur":""

updateProgress()
startTimer()

setTimeout(()=>{
input.focus()
},50)

}

function updateProgress(){
let percent=((current+1)/total)*100
document.getElementById("progressFill").style.width=percent+"%"
document.getElementById("progressText").innerText=`${current+1}/${total}`
}

function startTimer(){

clearInterval(timer)

timeLeft=roundTime
document.getElementById("timer").innerText=timeLeft

timer=setInterval(()=>{

timeLeft--
document.getElementById("timer").innerText=timeLeft

if(timeLeft<=0){
clearInterval(timer)
showPopup(false)
}

},1000)

}

function submitGuess(){

let input=document.getElementById("guessInput")
let guess=input.value.toLowerCase().trim()
let team=gameTeams[current]

if(team.answers.includes(guess)){

let base=100

if(bonusEnabled){
let percent=timeLeft/roundTime
let bonus=Math.floor(percent*100)
score+=base+bonus
}else{
score+=base
}

confetti()
showPopup(true)

}else{

mistakes++

if(mistakes>maxMistakes){
showPopup(false)
}else{
document.getElementById("message").innerText="Try again!"
input.focus()
}

}

}

function showPopup(correct){

clearInterval(timer)

let team=gameTeams[current]

document.getElementById("popup").classList.remove("hidden")
document.getElementById("revealedLogo").src=team.revealed

let earned=0

if(correct){

document.getElementById("resultStatus").innerText="Correct!"
document.getElementById("resultText").innerText="Answer: "+team.name

earned=bonusEnabled
?100+Math.floor((timeLeft/roundTime)*100)
:100

}else{

document.getElementById("resultStatus").innerText="Wrong!"
document.getElementById("resultText").innerText="Answer: "+team.name
earned=0

}

document.getElementById("points").innerText="+"+earned+" Points"
document.getElementById("popupProgress").innerText=`${current+1}/${total}`
document.getElementById("score").innerText=score

}

function nextLogo(){

document.getElementById("popup").classList.add("hidden")

current++

if(current>=total){
alert("Game Complete! Score: "+score)
location.reload()
}else{
updateProgress()
nextRound()
}

}

function quitGame(){
location.reload()
}

function openOptions(){
document.getElementById("optionsPopup").classList.remove("hidden")
}

function closeOptions(){
document.getElementById("optionsPopup").classList.add("hidden")
}

function openDifficulty(){
document.getElementById("difficultyPopup").classList.remove("hidden")
}

function closeDifficulty(){
document.getElementById("difficultyPopup").classList.add("hidden")
}

function openSelection(){
document.getElementById("selectionPopup").classList.remove("hidden")
}

function closeSelection() {
  document.getElementById("selectionPopup").classList.add("hidden");
}

function confetti(){

if(activeConfetti>=3) return

activeConfetti++

for(let i=0;i<40;i++){

let conf=document.createElement("div")

conf.style.position="fixed"
conf.style.width="6px"
conf.style.height="6px"
conf.style.background="white"
conf.style.left=Math.random()*100+"%"
conf.style.top="-10px"

let type=document.getElementById("confettiType").value

if(type==="circles") conf.style.borderRadius="50%"
if(type==="mix" && Math.random()>0.5) conf.style.borderRadius="50%"

document.body.appendChild(conf)

let fall=setInterval(()=>{

conf.style.top=parseFloat(conf.style.top)+5+"px"

if(parseFloat(conf.style.top)>window.innerHeight){
clearInterval(fall)
conf.remove()
}

},20)

}

setTimeout(()=>{
activeConfetti--
},1200)

}

document.addEventListener("keydown",function(e){

let popupOpen=!document.getElementById("popup").classList.contains("hidden")

if(popupOpen){

if(e.key==="Enter"||e.key===" "){
e.preventDefault()
nextLogo()
}

if(e.key==="Backspace"||e.key==="Delete"){
e.preventDefault()
quitGame()
}

return
}

if(e.key==="Enter"){
e.preventDefault()
submitGuess()
}

})
