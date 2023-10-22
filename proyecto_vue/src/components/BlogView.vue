<template>
    <div class="container">
      <div class="announcement-board">
        <div
          v-for="(post, index) in posts"
          :key="index"
          class="announcement-post"
        >
          <div class="post-title">{{ post.title }}</div>
          <div class="post-content">
            <div class="post-image">
              <img :src="post.image" alt="post image" />
            </div>
            <div class="post-description">{{ post.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        posts: [
          {
            title: "Living 1",
            image: require("@/assets/images/living1.jpg"),
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tincidunt risus eu porttitor volutpat. Phasellus justo justo, tristique eget elit vel, sodales posuere purus. Fusce id massa ac lorem maximus auctor non eu ante. In sapien leo, scelerisque non venenatis at, ullamcorper eu mauris. Proin id velit vel ipsum commodo hendrerit. Donec eleifend augue ut mi hendrerit, in feugiat lectus tincidunt. Suspendisse quis odio in arcu finibus consectetur sed a dolor. Suspendisse mattis velit in condimentum dictum. Aenean non magna sem.",
          },
          {
            title: "Living 2",
            image: require("@/assets/images/living2.jpg"),
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tincidunt risus eu porttitor volutpat. Phasellus justo justo, tristique eget elit vel, sodales posuere purus. Fusce id massa ac lorem maximus auctor non eu ante. In sapien leo, scelerisque non venenatis at, ullamcorper eu mauris. Proin id velit vel ipsum commodo hendrerit. Donec eleifend augue ut mi hendrerit, in feugiat lectus tincidunt. Suspendisse quis odio in arcu finibus consectetur sed a dolor. Suspendisse mattis velit in condimentum dictum. Aenean non magna sem.",
          },
          {
            title: "Living 3",
            image: require("@/assets/images/living3.jpg"),
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tincidunt risus eu porttitor volutpat. Phasellus justo justo, tristique eget elit vel, sodales posuere purus. Fusce id massa ac lorem maximus auctor non eu ante. In sapien leo, scelerisque non venenatis at, ullamcorper eu mauris. Proin id velit vel ipsum commodo hendrerit. Donec eleifend augue ut mi hendrerit, in feugiat lectus tincidunt. Suspendisse quis odio in arcu finibus consectetur sed a dolor. Suspendisse mattis velit in condimentum dictum. Aenean non magna sem.",
          },
        ],
      };
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap");
  
  * {
    font-family: "Poppins", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body, #app {
    height: 100%;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100%;
    padding: 20px;
    background-color: #fea162;
    width: 100%;
    justify-content: center;
    text-align: center;
  }
  
.announcement-board {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    flex-direction: column;
}
  
  .announcement-post {
    width: 95%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    margin: 10px;
  
    .post-title {
        text-align: start;
      font-size: 18px;
      font-weight: bold;
    }
  
    .post-content {
        margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
  
    .post-image {
      flex: 1;
      max-width: 10%;
      margin-right: 20px;
  
      img {
        width: 100%;
        border-radius: 5px;
      }
    }
  
    .post-description {
        flex: 1;
      font-size: 14px;
      text-align: start;
    }
  
    &:hover {
      transform: scale(1.05);
    }
  }
  
  @media screen and (max-width: 768px) {
    .announcement-post {
      .post-content {
        flex-direction: column;
      }
  
      .post-image {
        max-width: 100%;
        margin-right: 0;
        margin-bottom: 20px;
  
        img {
          height: 100%;
        }
      }
    }
  }
  </style>
  