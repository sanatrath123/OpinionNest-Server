const form = document.querySelector('form')

form.addEventListener('submit', function(e){
    e.preventDefault()
console.log(e.target?.[0].files)
})