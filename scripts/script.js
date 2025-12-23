let $passwordInput = $('#password');
let $repeatPassword = $('#rep-password');
let $checkbox = $('#privacy');
let $full_name = $('#full-name');
let $user_name = $('#user-name');
let $email = $('#mail');
let $info_title = $('#info-title');

$full_name.on('keydown', function (e) {
    if (!isNaN(parseInt(e.key))) {
        e.preventDefault();
    }
});

$user_name.on('keydown', function (e) {
    if ('.,'.indexOf(e.key) !== -1) {
        e.preventDefault();
    }
});

function signUp() {
    let hasError = false;

    if ($full_name.val().match(/^\s*$/)) {
        $full_name.next().text(`Заполните поле ${$full_name.prev().text()}`)
        $full_name.css('border-color', 'red');
        hasError = true;
    } else if (!$full_name.val().match(/^[А-ЯЁA-Z][а-яёa-z]+\s+[А-ЯЁA-Z][а-яёa-z]+$/)) {
        $full_name.next().text('Поле может содержать только буквы, пробелы. Слова начинаются с заглавной буквы')
        $full_name.css('border-color', 'red');
        hasError = true;
    } else {
        $full_name.next().text('')
        $full_name.css('border-color', '#C6C6C4');
    }

    if ($user_name.val().match(/^\s*$/)) {
        $user_name.next().text(`Заполните поле ${$user_name.prev().text()}`)
        $user_name.css('border-color', 'red');
        hasError = true;
    } else if (!$user_name.val().match(/^[A-Za-z0-9_-]+$/)) {
        $user_name.next().text('Поле может содержать только буквы, цифры, символ подчеркивания и тире')
        $user_name.css('border-color', 'red');
        hasError = true;
    } else {
        $user_name.next().text('')
        $user_name.css('border-color', '#C6C6C4');
    }

    if ($email.val().match(/^\s*$/)) {
        $email.next().text(`Заполните поле ${$email.prev().text()}`)
        $email.css('border-color', 'red');
        hasError = true;
    } else if (!$email.val().match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
        $email.next().text('E-mail некорректен')
        $email.css('border-color', 'red');
        hasError = true;
    } else {
        $email.next().text('')
        $email.css('border-color', '#C6C6C4');
    }

    if ($passwordInput.val().match(/^\s*$/)) {
        $passwordInput.next().text(`Заполните поле ${$passwordInput.prev().text()}`)
        $passwordInput.css('border-color', 'red');
        hasError = true;
    } else if (!$passwordInput.val().match(/^((?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])).{8,}$/)) {
        $passwordInput.next().text(' Поле пароля должно содержать минимум 8 символов, среди которых есть хотя бы одна буква в верхнем регистре, одна цифра и один спецсимвол')
        $passwordInput.css('border-color', 'red');
        hasError = true;
    } else {
        $passwordInput.next().text('')
        $passwordInput.css('border-color', '#C6C6C4');
    }

    if ($repeatPassword.val().match(/^\s*$/)) {
        $repeatPassword.next().text(`Заполните поле ${$repeatPassword.prev().text()}`)
        $repeatPassword.css('border-color', 'red');
        hasError = true;
    } else if ($repeatPassword.val() !== $passwordInput.val()) {
        $repeatPassword.next().text('Пароли не совпадают')
        $repeatPassword.css('border-color', 'red');
        hasError = true;
    } else {
        $repeatPassword.next().text('')
        $repeatPassword.css('border-color', '#C6C6C4');
    }

    if (!$checkbox.is(':checked')) {
        $checkbox.parent().next().text('Подтвердите соглашение с нашими Условиями обслуживания и Заявлением о конфиденциальности');
        $checkbox.css('border-color', 'red');
        hasError = true;
    } else {
        $checkbox.parent().next().text('')
    }

    if (!hasError) {
        const user = {
            fullName: $full_name.val(),
            username: $user_name.val(),
            email: $email.val(),
            password: $passwordInput.val()
        };

        let clients = JSON.parse(localStorage.getItem('clients')) || [];

        clients.push(user);

        localStorage.setItem('clients', JSON.stringify(clients));

        $('.form-input').each(function () {
            $(this).children().eq(1).val('');
        });

        $('#popup').show();
    }
}

let $button = $('#button');
$button.on('click', signUp);

let $popupButton = $('#popup-button');
$popupButton.on('click', function () {
    $('#popup').hide();
});
$popupButton.on('click', logInPage);
$('#account').on('click.first', logInPage).on('click.second', () => {$(':input').val('');});

function signIn() {
    let hasError = false;

    if (!userIsExists('username', $user_name.val())) {
        $user_name.next().text('Такой пользователь не зарегистрирован')
        $user_name.css('border-color', 'red');
        return;
    } else {
        $user_name.next().text('')
        $user_name.css('border-color', '#C6C6C4');
        isUserLoggedIn = true;
    }

    if (!passwordIsRight('username', $passwordInput.val(), $user_name.val())) {
        $passwordInput.next().text('Неверный пароль')
        $passwordInput.css('border-color', 'red');
        return;
    } else {
        $passwordInput.next().text('')
        $passwordInput.css('border-color', '#C6C6C4');
    }

    if (!hasError) {
        $info_title.text(`Welcome, ${getFullName($user_name.val())}!`)
        $button.text('Exit').off('click', signIn).on('click', () => {location.reload()});
        $('.info-description').remove();
        $user_name.parent().remove();
        $passwordInput.parent().remove();
        $('#account').parent().remove();
    }

}

function logInPage() {
    $info_title.text('Log in to the system');
    $('#group-full-name').remove();
    $('#group-mail').remove();
    $('#group-rep-password').remove();
    $('#group-privacy').remove();
    $button.text('Sign In');
    $('#account').text('Registration').off('click', signIn).on('click', () => {
        location.reload()
    });
    $button.off('click', signUp);
    $button.on('click', signIn);
}

function userIsExists(key, val) {
    let hasMatch = false
    let clients = JSON.parse(localStorage.getItem('clients')) || [];

    $.each(clients, function(index, value) {
        if (value[key] === val) {
            hasMatch = true;
        }
    });

    return hasMatch;
}

function passwordIsRight(key, password, username) {
    let hasMatch = false;
    let client = {};
    $.each(JSON.parse(localStorage.getItem('clients')), function(index, value) {
        if (value[key] === username) {
            console.log(value)
            client = value;
        }
    })

    if (client.password === password) {
        hasMatch = true;
    }
    return hasMatch;
}

function getFullName(val) {
    let fullName = '';
    $.each(JSON.parse(localStorage.getItem('clients')) || [], function(index, value) {
        if (value.username === val) {
            fullName = value.fullName;
        }
    })
    return fullName;
}