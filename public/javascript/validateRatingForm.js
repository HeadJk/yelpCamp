// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-rating-form')

    const stars = document.getElementsByName("review[rating]");
    const ratingText = document.querySelector('#ratingText');
    const starContainer = document.querySelector('.starability-basic');
    const invalidIcon = document.querySelector('#invalidIcon');
    const validIcon = document.querySelector('#validIcon');
    const reviewBody = document.querySelector('#reviewBody');

    // Loop over them and prevent submission
    Array.from(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            reviewBody.classList.remove('border-0');
            reviewBody.classList.add('border-danger');
        }
        if (stars[0].checked) {
            event.preventDefault()
            event.stopPropagation()
            ratingText.classList.add('text-danger');
            invalidIcon.classList.remove('d-none');
        }
        starContainer.addEventListener('click', function (e) {
            ratingText.classList.remove('text-danger');
            invalidIcon.classList.add('d-none');
            ratingText.classList.add('text-success');
            validIcon.classList.remove('d-none');
        })
        reviewBody.addEventListener('input', function (e) {
            reviewBody.classList.remove('border-danger');
            reviewBody.classList.add('border-success');
            if(reviewBody.value == "") {
                reviewBody.classList.remove('border-success');
                reviewBody.classList.add('border-danger');
            }
        })
        form.classList.add('was-validated')
        }, false)
    })
})()