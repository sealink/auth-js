### Why

Provides an api interface to the SeaLink auth service.

### Provides

- AWS JWK Authorizer (https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html)

### Deployment

Build / Deployment is handled via Github.
Package management is via NPM.

First create the release branch

```
git branch release/0.3.0
```

Second Update package.json and specify the version you are releasing

Next Tag and push to github

```
git tag v0.3.0
git push origin master --tags
```

Remember to merge changes back to the master branch
