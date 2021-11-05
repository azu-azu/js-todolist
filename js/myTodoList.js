const lists = document.getElementById("incomplete-ul").children;
const emptyListMessage = document.querySelector('.c-empty-tasks');

// リストが１つもないときはデフォルトテキスト表示
const toggleEmptyListMessage = function () {
    if (lists.length === 0) {//ulの子タグがゼロなら
        emptyListMessage.classList.remove('hidden');
    } else {
        emptyListMessage.classList.add('hidden');
    }
};


// inputに入力したらリストに追加
const onClickAdd = () => {
    const inputText = document.getElementById("js-add-input").value;// inputの値を取得する
    document.getElementById("js-add-input").value = "";// inputの値を初期化する

    myList(inputText);
};

// 未完了リストから完了リストへ移動
const toCompleteList = (target) => {
};

// 未完了リストから完了リストへ指定の要素を削除
const deleteFromIncompleteList = (target) => {
    document.getElementById("incomplete-ul").removeChild(target);
};

// チェックボックスがチェックされたら
const addCheckHandler = function (item) {
    let checkbox = item.querySelector('.c-item-name');
    checkbox.addEventListener('change', function () {
        item.remove();
        toggleEmptyListMessage();
    });
};

// ulの子タグ（li）をチェックハンドラに入れる
for (let i = 0; i < lists.length; i++) {
    addCheckHandler(lists[i]);
}



// 追加ボタンをクリックしたとき
const myList = (text) => {
    const listTemplate = document.querySelector('#js-list-template').content;//テンプレート
    const newTodo = listTemplate.firstElementChild.cloneNode(true);//テンプレートのli以下をクローン
    newTodo.firstElementChild.children[1].innerText = text;//inputされたテキスト取得

    // label
    const label = newTodo.firstElementChild;

    // TODOテキスト(spanタグ)
    const textSpan = label.children[1];
    textSpan.innerText = text;//inputされたテキスト追加

    // divタグ（c-actions）
    const actionDiv = newTodo.children[1];
    const prioritySpan = actionDiv.children[0];
    const editSpan = actionDiv.children[1];
    const deleteSpan = actionDiv.children[2];

    //todoListを、#incomplete-listの直下に生成
    document.getElementById("incomplete-ul").appendChild(newTodo);
    toggleEmptyListMessage();

    document.getElementById("js-add-input").value = '';//インプット初期化



    // ------------------------
    // labelをクリックしたとき
    // ------------------------
    label.addEventListener("click", () => {
        const parentLi = label.parentNode;// labelの親タグli
        toCompleteList(parentLi);// 未完了リストから削除
        document.getElementById("complete-ul").appendChild(newTodo);// 完了リストに追加

        // c-actions削除
        const div = newTodo.children[1];
        parentLi.removeChild(div);

        // inputをチェック済にする
        const completeInput = parentLi.firstElementChild.firstElementChild;
        completeInput.checked = true;

        // buttonsをテンプレートからクローン
        const btnTemplate = document.querySelector('#js-button-template').content;//テンプレート
        const newButtons = btnTemplate.firstElementChild.cloneNode(true);//テンプレートのdiv以下をクローン
        const delButton = newButtons.firstElementChild;
        const backButton = newButtons.children[1];

        // buttonsをnewTodoに追加
        newTodo.appendChild(newButtons);// buttonsを追加
        document.getElementById("complete-ul").appendChild(newTodo);//#complete-listの直下に生成

        // ------------------------
        // 削除ボタンをクリックしたとき
        // ------------------------
        delButton.addEventListener("click", () => {
            const deleteTarget = delButton.parentNode.parentNode;// 親ノード取得
            document.getElementById("complete-ul").removeChild(deleteTarget);//削除
        });

        // ------------------------
        // 戻すボタンをクリックしたとき
        // ------------------------
        backButton.addEventListener("click", () => {
            const deleteTarget = backButton.parentNode.parentNode;// 親ノード取得
            document.getElementById("complete-ul").removeChild(deleteTarget);//削除
            
            // TODOのテキスト取得・生成
            const backText = deleteTarget.firstElementChild.children[1].innerText;
            myList(backText);
        });
    });


    // ------------------------
    // 優先ボタンをクリックしたとき
    // ------------------------
    prioritySpan.addEventListener("click", () => {
        const parentLi = prioritySpan.parentElement.parentElement;
        if(parentLi.classList.contains('c-priority--higher')){
            parentLi.classList.add("reset");
            parentLi.classList.remove("c-priority","c-priority--high","c-priority--higher");
            return false;

        }else if (parentLi.classList.contains('c-priority--high')){
            parentLi.classList.add("c-priority--higher");
        }else{
            parentLi.classList.add("c-priority","c-priority--high");
        }
    });

    // ------------------------
    // pencilボタンをクリックしたとき
    // ------------------------
    editSpan.addEventListener("click", () => {
        editTodo(editSpan);
    });

    // 編集後、Enterを押したとき
    editSpan.parentElement.previousElementSibling.children[2].onkeyup = function (e) {
        if (e.key === "Enter") {
            endEditingTodo(editSpan);
        }
    };

    // ------------------------
    // 削除ボタンをクリックしたとき
    // ------------------------
    deleteSpan.addEventListener("click", () => {
        // 押された削除ボタンの親タグ(li)を未完了リストから削除
        deleteFromIncompleteList(deleteSpan.parentNode.parentNode);
        toggleEmptyListMessage();
    });
};


//onClickAddの実行
document.getElementById("js-add-button").addEventListener('click', () => {
    // e.preventDefault();
    onClickAdd();
});

// Edit Todo
function editTodo(e) {
    // previousElementSibling:前の要素
    if(e.classList.contains('fa-pencil')) {
        const textInput = e.parentElement.previousElementSibling.children[2];// input
        const textSpan = e.parentElement.previousElementSibling.children[1];// span
        const content = textSpan.innerText;

        textInput.classList.add('show');
        textSpan.classList.add('hide');
        textInput.value = content;
        textInput.select();
    }
};

// End editing Todo
function endEditingTodo(e) {
    if(e.classList.contains('fa-pencil')) {
        const textInput = e.parentElement.previousElementSibling.children[2];// input
        const textSpan = e.parentElement.previousElementSibling.children[1];// span
        const content = textInput.value;// inputの値を取得
        textInput.classList.remove('show');
        textSpan.classList.remove('hide');
        textSpan.innerText = content;
    }
};