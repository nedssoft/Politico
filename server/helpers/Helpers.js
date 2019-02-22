/* istanbul ignore file */
import Datauri from 'datauri';
import path from 'path';
import uploader from '../config/cloudinaryConfig';

const dUri = new Datauri();
const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
class Helpers {
  static extractErrors(errors) {
    const validationErrors = [];
    errors.map(error => validationErrors.push(error.msg));
    return validationErrors;
  }

  static isANumber(num) {
    return Number.isInteger(Number(num));
  }

  static uploadImage(req) {
    let response;
    if (req.file) {
      const file = dataUri(req).content;
      response = uploader.upload(file).then(result => result.secure_url).catch((err) => {
        if (err) {
          return false;
        }
      });
      return response;
    } return false;
  }

  static template(url) {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <title>POLITICO</title>
              <style>
                * {
                  box-sizing: border-box;
                }
              html, body{
                height: 100vh;
              }
              body {
                padding: 0;
                margin: 0;
              }
              
              .container {
                border: 1px solid #6784C7;;
                height: 50vh;
                align-items: center;
                padding: 20px;
              }
              
              a {
                background: #6784C7;
                border: none;
                outline: none;
                color: aliceblue;
                font-size: 0.8rem;
                cursor: pointer;
                opacity: 0.8;
                padding: 0.8rem;
                width: 10rem;
                text-align: center;
                font-size: 1rem;
              }
              a:hover {
                opacity: 1;
              }
              </style>
            </head>
            <body>
              <div class="container">
                  <h1>Password Reset</h1>
                  <p>You requested to reset your POLITICO password</p>
                  <p>If this is you, Click the link below to continue</p><br>
                  <a href="${url}">Reset Password</a>
              </div>
            </body>
            </html>`;
  }

  static resetTemplate(email = '', error = '') {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <title>POLITICO</title>
              <style>
                * {
                  box-sizing: border-box;
                }
              html, body{
                height: 100vh;
              }
              body {
                padding: 0;
                margin: 0;
              }
              .form-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 80vh;
              }
              input {
                outline: none;
                padding: 0.8rem;
                margin: 0.5rem auto;
                width: 250px;
                /* border-radius: 3px; */
              }
              .container {
                border: 1px solid #6784C7;;
                height: 100vh;
              }
              .form-group {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
              }
              input[type="submit"]{
                background: #6784C7;
                border: none;
                outline: none;
                color: aliceblue;
                font-size: 0.8rem;
                cursor: pointer;
                opacity: 0.8;
              }
              input[type="submit"]:hover {
                opacity: 1;
              }
              fieldset {
                padding: 10px;
                border: 1px solid #6784C7;
              }
              .alert{
                padding: 10px;
                text-align: center;
                width: 250px;
                background: red;
                color: aliceblue;
                font-style: bold;
                overflow-wrap: break-word;
              }
              @media screen and (min-width: 768px) {
                input, .alert {
                  width: 350px;
                }
              }
              </style>
            </head>
            <body>
              <div class="container">
                <form action="/password/reset" method="post">
                  <div class="form-container">
                      <fieldset>
                        <legend>Password Reset</legend>
                          ${error}
                          <div class="form-group">
                              <label>New Password:</label>
                              <input name="password" type="password">
                          </div>
                          <div class="form-group">
                              <label>Confirm Password</label>
                              <input name="passwordConfirmation" type="password">
                          </div>
                          <input type="hidden" name="email" value="${email}">
                          <input type="submit" value="Reset">
                      </fieldset>
                  </div>
                </form>
              </div>
            </body>
            </html>`;
  }

  static errorTemplate(error) {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <title>POLITICO</title>
              <style>
                * {
                  box-sizing: border-box;
                }
              html, body{
                height: 100vh;
              }
              body {
                padding: 0;
                margin: 0;
              }
              
              .container {
                border: 1px solid #6784C7;;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              .error {
                width: 250px;
                overflow-wrap: break-word;
                background: red;
                color: aliceblue;
                font-size: 18px;
                text-align: center;
                padding: 20px 0;
              }
              @media screen and (min-width: 768px) {
                .error {
                  width: 300px;
                }
              }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="error">${error}</div>
              </div>
            </body>
            </html>`;
  }

  static successTemplate(success, url = '') {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <title>POLITICO</title>
              <style>
                * {
                  box-sizing: border-box;
                }
              html, body{
                height: 100vh;
              }
              body {
                padding: 0;
                margin: 0;
              }
              
              .container {
                border: 1px solid #6784C7;;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              .success {
                width: 250px;
                overflow-wrap: break-word;
                background: green;
                color: aliceblue;
                font-size: 18px;
                text-align: center;
                padding: 20px 0;
              }
              a {
                background: #6784C7;
                border: none;
                outline: none;
                color: aliceblue;
                font-size: 0.8rem;
                cursor: pointer;
                opacity: 0.8;
                padding: 0.8rem;
                width: 10rem;
                text-align: center;
                font-size: 1rem;
                margin-top: 20px;
              }
              a:hover {
                opacity: 1;
              }
              @media screen and (min-width: 768px) {
                .success {
                  width: 300px;
                }
              }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="success">${success}</div>
                ${url}
              </div>
            </body>
            </html>`;
  }

  static indexTemplate() {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <title>POLITICO</title>
              <style>
                * {
                  box-sizing: border-box;
                }
              html, body{
                height: 100vh;
              }
              body {
                padding: 0;
                margin: 0;
              }
              
              .container {
                border: 1px solid #6784C7;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              .container> div {
            
                font-size: 15rem;
                text-align: center;
                
              }
              hr {
                border: 1px solid #6784C7;
                width: 10rem;
                padding: 0;
                margin: 0;
              }
              @media screen and (min-width: 768px) {
                .error {
                  width: 300px;
                }
              }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>POLITICO</h1>
                <h3>Developed By: <a href="https://twitter.com/nedusoft">Orie Chinedu</a></h3> <hr>
              </div>
            </body>
            </html>`;
  }
}

export default Helpers;
