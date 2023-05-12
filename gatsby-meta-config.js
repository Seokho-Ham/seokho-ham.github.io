module.exports = {
  title: `@forkyy`,
  description: `@forkyy`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://seokho-ham.github.io`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: `seokho-ham/blog-comments`, // `zoomkoding/zoomkoding-gatsby-blog`,
    },
  },
  ga: 'G-CB1VRBHVBC', // Google Analytics Tracking ID
  author: {
    name: `함석호`,
    bio: {
      role: `개발자`,
      description: ['꾸준히 성장하는', '함께 일하고 싶은', '실패를 두려워 하지 않는'],
      thumbnail: 'profile-image.png', // Path to the image in the 'asset' folder
    },
    social: {
      github: `https://github.com/seokho-ham`, // `https://github.com/zoomKoding`,
      linkedIn: '',//`https://www.linkedin.com/in/%EC%84%9D%ED%98%B8-%ED%95%A8-12b050224/`, // `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
      email: `forkyy.dev@gmail.com`, // `zoomkoding@gmail.com`,
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        date: '2022.01.03 ~ 2022.07.01',
        activity: '코드스쿼드 마스터즈 코스 (백엔드)',
        // links: {
        //   post: '/gatsby-starter-zoomkoding-introduction',
        //   github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
        //   demo: 'https://www.zoomkoding.com',
        // },
      },
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      // {
      //   title: '개발 블로그 테마 개발',
      //   description:
      //     '개발 블로그를 운영하는 기간이 조금씩 늘어나고 점점 많은 생각과 경험이 블로그에 쌓아가면서 제 이야기를 담고 있는 블로그를 직접 만들어보고 싶게 되었습니다. 그동안 여러 개발 블로그를 보면서 좋았던 부분과 불편했던 부분들을 바탕으로 레퍼런스를 참고하여 직접 블로그 테마를 만들게 되었습니다.',
      //   techStack: ['gatsby', 'react'],
      //   thumbnailUrl: 'blog.png',
      //   links: {
      //     post: '/gatsby-starter-zoomkoding-introduction',
      //     github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
      //     demo: 'https://www.zoomkoding.com',
      //   },
      // },
    ],
  },
};
