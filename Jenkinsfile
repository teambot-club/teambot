#!groovy

def buildNumber = "${env.BUILD_DISPLAY_NAME}"

node {
  stage("Checkout") {
    checkout scm
  }

  docker.withTool('docker') {
    version = getVersion()
    try {
      def newImage = buildImage(version)
      echo "newImage: ${newImage.id}"
      deployService('teambot', newImage)
      currentBuild.displayName = "${buildNumber} - ${version}"
    } catch(err) {
      echo "${err}"
      currentBuild.result = 'FAILURE'
      currentBuild.displayName = "${buildNumber} - ${err.getMessage()}"
    }
  }
}

def buildImage(version) {
    def image
  stage("Build Image") {
    if (!version) {
      error 'No version to build'
    }
    image = docker.build("teambot/teambot:${version}")
  }
  return image
}

def deployService(service, newImage) {
  stage("Deploy") {
    if(!version) {
      error "No version to deploy"
    }

    def getCurrentImage = { ->
      def stdout = sh script: "docker service inspect ${service}", returnStdout: true
      echo "${stdout}"
      def spec = new groovy.json.JsonSlurper().parseText(stdout.trim())

      if (!spec.size()) {
        return null
      }

      def result = spec[0].Spec.TaskTemplate.ContainerSpec.Image
      return result
    }

    sh "docker service update ${service} --image=${newImage.id}"

    waitForDeployment {
      currentImage = getCurrentImage()
      expectedImage = newImage.id
      name = "${service}"
    }

  }
}

def waitForDeployment(Closure cl) {
  def deployment = [:]
  cl.delegate = deployment
  cl.resolveStrategy = Closure.DELEGATE_FIRST
  cl()

  timeout(2) {
    waitUntil {
      try {
        def currentImage = sh(
          script: "docker ps --format '{{ .Image }}' | grep ${deployment.name}",
          returnStdout: true)
          echo "${currentImage} - ${deployment.expectedImage}"
        return currentImage.trim() == deployment.expectedImage
      } catch(err) {
        return false
      }
    }
  }
}

String getVersion() {
  def latestTag = ''
  try {
    latestTag = sh script: "git describe --tags", returnStdout: true
  } catch(err) {
    return latestTag.trim()
  }
  return latestTag.trim()
}
