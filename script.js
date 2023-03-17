const commentList = document.getElementById('comment-list');
const commentForm = document.getElementById('comment-form');
const nameInput = document.getElementById('name');
const commentInput = document.getElementById('comment');
const dateInput = document.getElementById('date');
const submitBtn = document.getElementById('submit-btn');

let comments = [];


if (localStorage.getItem('comments')) {
    comments = JSON.parse(localStorage.getItem('comments'));
    showComments();
}


commentForm.addEventListener('submit', addComment);

function addComment(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();
    const date = dateInput.value || new Date().toISOString().split('T')[0];


    if (!name || !comment) {
        alert('Please fill out all fields.');
        return;
    }

    const newComment = {
        name,
        comment,
        date
    };


    comments.push(newComment);


    localStorage.setItem('comments', JSON.stringify(comments));


    showComments();


    nameInput.value = '';
    commentInput.value = '';
    dateInput.value = '';
}

function showComments() {
    commentList.innerHTML = '';
    comments.forEach((comment, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
      <div class="comment">
        <div class="comment-header">
          <span class="comment-author">${comment.name}</span>
          <span class="comment-date">${formatDate(comment.date)}</span>
          <button class="delete-btn" data-index="${index}"><img scr= "trsh.png" alt="Delete"></button>
        </div>
        <div class="comment-body">${comment.comment}</div>
        <button class="like-btn" data-index="${index}"><img scr="like.png" alt="Like"></button>
      </div>
    `;
        commentList.appendChild(li);
    });


    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', deleteComment);
    });


    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', toggleLike);
    });
}

function deleteComment(e) {
    const index = e.target.dataset.index;
    comments.splice(index, 1);
    localStorage.setItem('comments', JSON.stringify(comments));
    showComments();
}

function toggleLike(e) {
    const index = e.target.dataset.index;
    comments[index].liked = !comments[index].liked;
    localStorage.setItem('comments', JSON.stringify(comments));
    showComments();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    if (date.toDateString() === today.toDateString()) {
        return 'Today, ' + formatDateSegment(date.getHours()) + ':' + formatDateSegment(date.getMinutes());
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday, ' + formatDateSegment(date.getHours()) + ':' + formatDateSegment(date.getMinutes());
    } else {
        return date.toLocaleDateString() + ', ' + formatDateSegment(date.getHours()) + ':' + formatDateSegment(date.getMinutes());
    }
}

function formatDateSegment(segment) {
    return ('0' + segment).slice(-2);
}