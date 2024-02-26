<p align="center">
  <img src="./public/connect.jpg" />
</p>
<div style="text-align:center;" align="center">Connect Green
   
<br>
    <a href="https://github.com/GDSc-Solution-Climate/Tree-Plantation-Backend"><strong>Learn more »</strong></a>
    <br>
    <a href="https://github.com/GDSc-Solution-Climate/Tree-Plantation-Backend/issues">Issues</a>
</div>

## About this project

Connect Green is an app that allows you to capture precious moments, as your plant grows,commemorate their milestone with their images as threads.It provides advice to your specific needs whether you are an novice gardener or experienced enthusiast.

This project was inspired by the conditions of Delhi NCR where every winters the AQI of city is at it's peak. We believe that to sustain the development of cities we have to make our cities cleaner and greener.

Connect Green's aim is to improve air quality and promote sustainable living in urban areas by leveraging the benefits of plants and trees.
Join us in our journey to build and integrate new technologies to reduce enviornmental crisis.

<div style="text-align:center;"> -
<a href="https://twitter.com/SatvikManchanda">
 @SatvikManchanda
 </a>
 </div>


## Contact us

Please feel free to contact us if you are interested in our Enterprise plan for large organizations that need extra flexibility and control.

<a href="https://cal.com/satvikmanchanda/connect-green"><img alt="Book us with Cal.com" src="https://cal.com/book-with-cal-dark.svg" /></a>

## Tech Stack

- [Typescript](https://www.typescriptlang.org/) - Language
- [Next.js](https://nextjs.org/) - Framework
- [MongoDB](https://mongodb.com/) - Database
- [Vercel](https://vercel.com) - Hosting
## Local Development

### Requirements

To run Connect Green locally, you will need

- Node.js
- MongoDB

## Developer Setup

### Manual Setup

> [!TIP]
> Use [pnpm](https://pnpm.io/) for fast installation and efficient disk management.

Follow these steps to setup Datewise on your local machine:

1. [Fork this repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks) to your GitHub account.

After forking the repository, clone it to your local device by using the following command:

```sh
git clone https://github.com/<your-username>/Tree-Plantation-Backend
```

2. Run `npm i` in the root directory

3. Create your `.env` from the `.env.example`. You can use `cp .env.example .env` to get started with our handpicked defaults.

4. Set the following environment variables:

   - MONGO_URL
   - NEXTAUTH_URL  (should be set as http(s)://localhost:[port])
   - NEXTAUTH_SECRET (can be random string or you can generate from openssl) 
   - JWT_SECRET (can be random string or you can generate from openssl) 
   - GEMINI_API_KEY
   -CLOUD_NAME(you can get it from cloudinary)
   -CLOUDINARY_API_KEY
   -CLOUDINARY_API_SECRET

5. Run `npm run dev` in the root directory to start


