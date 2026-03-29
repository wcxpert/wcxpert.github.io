function saveSettings(){
localStorage.setItem("logoCount", slider.value)
localStorage.setItem("blur", document.getElementById("blurToggle").value)
localStorage.setItem("confetti", document.getElementById("confettiType").value)
localStorage.setItem("time", document.getElementById("timeSelect").value)
localStorage.setItem("bonus", document.getElementById("bonusToggle").value)
}

function loadSettings(){
let lc = localStorage.getItem("logoCount")
let blur = localStorage.getItem("blur")
let conf = localStorage.getItem("confetti")
let time = localStorage.getItem("time")
let bonus = localStorage.getItem("bonus")

if(lc){
slider.value = lc
logoInput.value = lc
logoCount.innerText = lc
}

if(blur) document.getElementById("blurToggle").value = blur
if(conf) document.getElementById("confettiType").value = conf
if(time) document.getElementById("timeSelect").value = time
if(bonus) document.getElementById("bonusToggle").value = bonus
}

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
let roundTime=15
let bonusEnabled=true

const slider=document.getElementById("logoSlider")
const logoCount=document.getElementById("logoCount")
const logoInput=document.getElementById("logoInput")
const guessInput=document.getElementById("guessInput")

guessInput.setAttribute("autocomplete","off")

slider.oninput=()=>{
logoCount.innerText=slider.value
logoInput.value=slider.value
}

logoInput.oninput=()=>{
let val=Math.max(5,Math.min(100,logoInput.value))
slider.value=val
logoCount.innerText=val
}

slider.onchange=saveSettings
logoInput.onchange=saveSettings
document.getElementById("blurToggle").onchange=saveSettings
document.getElementById("confettiType").onchange=saveSettings
document.getElementById("timeSelect").onchange=saveSettings
document.getElementById("bonusToggle").onchange=saveSettings

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

function getLeagueArray(name){
if(name==="premier") return premierLeague
if(name==="laliga") return laliga
if(name==="bundesliga") return bundesliga
if(name==="ligue1") return ligue1
return []
}

function buildTeams(){
allTeams=[]
selectedLeagues.forEach(l=>{
allTeams.push(...getLeagueArray(l))
})
}

function startDifficultyGame(level){

let list = difficultyData[level]

allTeams=[]

list.forEach(item=>{
let arr=getLeagueArray(item.league)
let team=arr.find(t=>t.id===item.id)
if(team) allTeams.push(team)
})

total=Math.min(parseInt(slider.value), allTeams.length)

closeDifficulty()
startGame()
}

function startSelectionGame(){
if(selectedLeagues.length===0){
alert("Select at least one league!")
return
}
buildTeams()
closeSelection()
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
guessInput.value=""
document.getElementById("message").innerText=""

let team=gameTeams[current]
let logo=document.getElementById("logo")

logo.src=team.hidden

let blurEnabled=document.getElementById("blurToggle").value==="yes"
logo.className=blurEnabled?"blur":""

updateProgress()
startTimer()

setTimeout(()=>{
guessInput.focus()
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
showPopup(false,0,0)
}

},1000)
}

function submitGuess(){

let guess=guessInput.value.toLowerCase().trim()
let team=gameTeams[current]

if(team.answers.includes(guess)){

let base=100
let bonus=bonusEnabled?Math.floor((timeLeft/roundTime)*100):0

score+=base+bonus

confetti()
showPopup(true,base,bonus)

}else{

mistakes++

if(mistakes>maxMistakes){
showPopup(false,0,0)
}else{
document.getElementById("message").innerText="Try again!"
guessInput.focus()
}

}
}

function showPopup(correct,base,bonus){

clearInterval(timer)

let team=gameTeams[current]

document.getElementById("popup").classList.remove("hidden")

let logo=document.getElementById("revealedLogo")
logo.src=team.revealed
logo.style.maxWidth="300px"
logo.style.height="auto"

if(correct){
document.getElementById("resultStatus").innerText="Correct!"
document.getElementById("resultText").innerText="Answer: "+team.name
document.getElementById("points").innerText=
bonusEnabled?`${base} (+${bonus}) Points`:`${base} Points`
}else{
document.getElementById("resultStatus").innerText="Wrong!"
document.getElementById("resultText").innerText="Answer: "+team.name
document.getElementById("points").innerText="0 Points"
}

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

function closeSelection(){
document.getElementById("selectionPopup").classList.add("hidden")
}

function confetti(){

let type=document.getElementById("confettiType").value
if(type==="off") return
if(activeConfetti>=3) return

activeConfetti++

for(let i=0;i<3;i++){

let x=Math.random()*100

for(let j=0;j<12;j++){

let conf=document.createElement("div")

conf.style.position="fixed"
conf.style.width="6px"
conf.style.height="6px"
conf.style.background="white"
conf.style.left=x+"%"
conf.style.top="-10px"

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
}

setTimeout(()=>{activeConfetti--},1200)
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

window.onload=loadSettings
