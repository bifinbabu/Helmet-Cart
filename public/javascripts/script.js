

function addToCart(proId) {
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $('#cart-count').html(count)
                // alert("Item added to cart")
            }

        }
    })
}
function changeQuantity(cartId, proId, userId, count) {
    let quantity = parseInt(document.getElementById(proId).innerHTML)
    count = parseInt(count)
    $.ajax({
        url: '/change-product-quantity',
        data: {
            user: userId,
            cart: cartId,
            product: proId,
            count: count,
            quantity: quantity
        },
        method: 'post',
        success: (response) => {
            if (response.removeProduct) {
                alert("Product removed from cart")
                location.reload();
            } else {
                document.getElementById(proId).innerHTML = quantity + count
                document.getElementById('total').innerHTML = response.total
            }
        }
    })
}
function removeProduct(cartId, proId) {
    $.ajax({
        url: '/remove-from-cart/' + cartId,
        data: {
            cart: cartId,
            product: proId
        },
        method: 'post',
        success: (response) => {
            if (response.status) {
                alert("Product removed from cart using remove button")
                location.reload();
            }
        }
    })
}
$("#checkout-form").submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/place-order',
        method: 'post',
        data: $('#checkout-form').serialize(),
        success: (response) => {
            // alert(response)
            if (response.codSuccess) {
                location.href = '/order-success'
            } else {
                razorpayPayment(response)
            }
        }
    })
})

function razorpayPayment(order) {
    var options = {
        "key": "rzp_test_A6e4AU60dG6u2P", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Crossroads",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)

            verifyPaymentAjax(response, order)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
}

function verifyPaymentAjax(payment, order) {
    $.ajax({
        url: '/verify-payment',
        data: {
            payment,
            order
        },
        method: 'post',
        success: (response) => {
            if (response.status) {
                location.href = '/order-success'
            } else {
                alert('Payment failed (This is a message passed from ajax verifyPayment)')
                alert(response.errMsg)
            }
        }
    })
}

//function for search bar for admin
$(function () {
    $('#productsTable').DataTable();
});

//function for search bar of user
var buttonUp = () => {
    const input = document.querySelector(".searchbox-input");
    const cards = document.getElementsByClassName("card");
    let filter = input.value
    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].querySelector(".card-body");
        if (title.innerText.indexOf(filter) > -1) {
            cards[i].classList.remove("d-none")
        } else {
            cards[i].classList.add("d-none")
        }
    }
}

// $(document).ready(function(){
//     $('#searchbox-input').on('keyup',function(){
//         var value = $(this).val().toLowerCase();
//         $('#card div').filter(function(){
//             $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1 );
//         })
//     })
// })

// $('.searchbox-input').change( function () {
//     $('.card').show();
//     var filter = $(this).val(); // get the value of the input, which we filter on
//     $('.container').find(".card-title:not(:contains(" + filter + "))").parent().css('display','none');
// });


// function myFunction() {
//     var input, filter, cards, cardContainer, title, i;
//     input = document.getElementById("searchbox-input");
//     filter = input.value.toUpperCase();
//     cardContainer = document.getElementById("productCards");
//     cards = cardContainer.getElementsByClassName("card");
//     for (i = 0; i < cards.length; i++) {
//       title = cards[i].querySelector(".card-body");
//       if (title.innerText.toUpperCase().indexOf(filter) > -1) {
//         cards[i].style.display = "";
//       } else {
//         cards[i].style.display = "none";
//       }
//     }
//   }
