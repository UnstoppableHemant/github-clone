const baseURI = 'https://api.github.com';
let rowsPerPage = parseInt($("#rowsPerPage").val());
let pageNum = parseInt($("#pageNumber").val());
let totalPage = 0;
let startIndex = 0;
let endIndex = rowsPerPage;
let userProfileData = {};
let userReposData = [];

$(document).ready(function () {
    fetchUserProfile();
});

$("#searchBtn").click(function () {
    fetchUserProfile();
});

const displayPreloader = () => {
    $(".loader, .overlay").addClass("displayLoader");
}

const disablePreloader = () => {
    $(".loader, .overlay").removeClass("displayLoader");
}

const fetchUserProfile = async () => {
    displayPreloader();
    let userName = $("#Username").val();
    const response = await fetch(baseURI + '/users/' + userName);
    userProfileData = await response.json(); //extract JSON from the http response
    console.log(userProfileData);
    let renderUserProfile = `<div class="row px-3 py-1">
                                <div class="col-md-12 col-3 d-flex">
                                    <div class="rounded-pill border border-3 p-1 m-auto">
                                        <img class="img-fluid rounded-pill" src="${userProfileData.avatar_url}" alt="userImage" style="min-width:50px" />
                                    </div>
                                </div>
                                <div class="col-md-12 col-9 px-3">
                                    <h3 class="fw-bold">${userProfileData.name}</h3>
                                    <h5 class="fw-light">${userProfileData.login}</h5>
                                    <p class="fw-light">${userProfileData.bio}</p>
                                </div>
                            </div>
                            <div class="px-3 py-1">
                                <button class="btn btn-secondary w-100">Follow</button>
                                <div class="d-flex mt-3 gap-1">
                                    <span><i class="fa fa-user-plus"></i></span>
                                    <span><b>${userProfileData.followers} </b>follower </span>
                                    <span> . </span>
                                    <span><b>${userProfileData.following} </b>following </span>
                                </div>
                                <div class="d-flex mt-3 gap-1">
                                    <span><i class="fa fa-map-marker"></i></span>
                                    <span>${userProfileData.location}</span>
                                </div>
                            </div>`;
    $("#renderUserProfile").html(renderUserProfile);
    fetchUserRepos();
    console.log(renderUserProfile);
}

const fetchUserRepos = async () => {
    let userName = $("#Username").val();
    const response = await fetch(baseURI + '/users/' + userName + '/repos?per_page=100');
    userReposData = await response.json(); //extract JSON from the http response
    paginationItems();
}

const setItemsPerPage = () => {
    rowsPerPage = parseInt($("#rowsPerPage").val());
    startIndex = 0;
    endIndex = rowsPerPage;
    pageNum = 1;
    paginationItems();
    $("#pageNumber").val(pageNum);
    console.log(rowsPerPage);
}

const nextPage = () => {
    $("#pre").removeAttr("disabled","disabled");
    rowsPerPage = parseInt($("#rowsPerPage").val());
    if (endIndex < userReposData.length) {
        startIndex += rowsPerPage;
        endIndex += rowsPerPage;
        pageNum += 1;
        console.log(endIndex + "is less");
    }
    else {
        console.log(endIndex + "is more");
        $("#nxt").attr("disabled","disabled");
    }
    $("#pageNumber").val(pageNum);
    paginationItems();
}

const prevPage = () => {
    $("#nxt").removeAttr("disabled","disabled");
    rowsPerPage = parseInt($("#rowsPerPage").val());
    if (startIndex !== 0) {
        startIndex -= rowsPerPage;
        endIndex -= rowsPerPage;
        pageNum -= 1;
        console.log(endIndex + "is less");
    }
    else {
        console.log(endIndex + "is more");
        $("#pre").attr("disabled","disabled");
    }
    $("#pageNumber").val(pageNum);
    paginationItems();
}

const paginationItems = () => {
    totalPage = Math.ceil(userReposData.length / rowsPerPage);
    let renderRepos = userReposData.slice(startIndex, endIndex).map(item => {
        return (
            `<div class="col-md-6 col-12 p-2">
                <div class="p-2 border border-1 rounded h-100 d-flex gap-1 flex-column justify-content-between">
                    <div>
                        <h5>${item.name}</h5>
                        ${item.description != null ? '<p>' + item.description + '</p>' : ''}
                    </div>
                    <div class="row">${item.topics != [] ? item.topics.map(topic => {
                return (
                    '<div class="col-auto py-1"><button class="btn btn-primary btn-sm">' + topic + '</button></div>'
                )
            }).join(" ") : ''}</div>
                </div>
            </div>`
        )
    });
    $("#renderRepos").html(renderRepos);
    disablePreloader();
}
