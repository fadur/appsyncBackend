build:
	cd cognitoBackend && docker build -t cognitobackend . 

login:
		aws ecr get-login-password --region $$AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $$ACCOUNT.dkr.ecr.$$AWS_DEFAULT_REGION.amazonaws.com

push:
		docker tag cognitobackend:latest $$ACCOUNT.dkr.ecr.$$AWS_DEFAULT_REGION.amazonaws.com/cognitobackend:latest && \
		docker push $$ACCOUNT.dkr.ecr.$$AWS_DEFAULT_REGION.amazonaws.com/cognitobackend:latest 


deploy:
	aws apprunner list-services | jq '.ServiceSummaryList[] | select(.ServiceName == "AppRunnerServiceA852BA10-BwquvnUXQ9s7") | .ServiceArn' | xargs \
		aws apprunner start-deployment --service-arn --output text
