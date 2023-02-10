// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

const apiStatus = {
  initial: 'INITIAl',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {cowinListData: [], status: apiStatus.initial}

  componentDidMount() {
    this.getCowinData()
  }

  getFormattedDate = eachDay => ({
    dose1: eachDay.dose_1,
    dose2: eachDay.dose_2,
    vaccineDates: eachDay.vaccine_dates,
  })

  getFormattedAge = eachAge => ({
    age: eachAge.age,
    count: eachAge.count,
  })

  getFormattedGender = eachGender => ({
    count: eachGender.count,
    gender: eachGender.gender,
  })

  getCowinData = async () => {
    this.setState({status: apiStatus.inProgress})

    const url = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(url)

    console.log(response)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachDay =>
          this.getFormattedDate(eachDay),
        ),
        vaccinationByAge: data.vaccination_by_age.map(eachAge =>
          this.getFormattedAge(eachAge),
        ),
        vaccinationByGender: data.vaccination_by_gender.map(eachGender =>
          this.getFormattedGender(eachGender),
        ),
      }
      this.setState({cowinListData: updatedData, status: apiStatus.success})
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-image"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderCowinStatusCharts = () => {
    const {cowinListData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByAge,
      vaccinationByGender,
    } = cowinListData
    return (
      <div>
        <VaccinationCoverage
          last7DaysVaccinationDetails={last7DaysVaccination}
        />
        <VaccinationByGender vaccinationByGenderDetails={vaccinationByGender} />
        <VaccinationByAge vaccinationByAgeDetails={vaccinationByAge} />
      </div>
    )
  }

  renderByApiStatus = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.success:
        return this.renderCowinStatusCharts()
      case apiStatus.failure:
        return this.renderFailureView()
      case apiStatus.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="logo-container">
          <img
            alt="website logo"
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          />
          <p className="cowin-name">Co WIN</p>
        </div>
        <h1>CoWIN Vaccination in India</h1>
        {this.renderByApiStatus()}
      </div>
    )
  }
}

export default CowinDashboard
