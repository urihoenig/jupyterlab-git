import * as React from 'react'

import {
  Git
} from '../git'

import {
  CommitBox
} from './CommitBox'

import {
  NewBranchBox
} from './NewBranchBox'

import {
  branchStyle,
  branchLabelStyle,
  headerButtonStyle,
  headerButtonDisabledStyle,
  branchListItemStyle,
  stagedCommitButtonStyle,
  stagedCommitButtonReadyStyle,
  stagedCommitButtonDisabledStyle,
} from '../components_style/BranchHeaderStyle'

import {
  openHistorySideBarButtonStyle
} from '../components_style/HistorySideBarStyle';

import {
  classes
} from 'typestyle'

import '../../style/index.css'

export interface IBranchHeaderState {
  topRepoPath: string,
  currentBranch: string,
  data: any,
  refresh: any,
  disabled: boolean,
  showNotice: boolean,
  dropdownOpen: boolean
  showCommitBox: boolean,
  showNewBranchBox: boolean
}

export interface IBranchHeaderProps {
  currentFileBrowserPath: string,
  topRepoPath: string,
  currentBranch: string,
  stagedFiles: any
  data: any,
  refresh: any,
  disabled: boolean,
  toggleSidebar: Function
}

export class BranchHeader extends React.Component<IBranchHeaderProps, IBranchHeaderState>{
  interval: any
  constructor(props: IBranchHeaderProps) {
    super(props)
    this.state = {
      topRepoPath: props.topRepoPath, 
      currentBranch: props.currentBranch, 
      data: [], 
      refresh: props.refresh, 
      disabled: props.disabled, 
      showNotice: false,
      dropdownOpen: false,
      showCommitBox: true,
      showNewBranchBox: false
    }
  }

  /** Commit all staged files */
  commitAllStagedFiles = (message: string, path: string) : void => {
    if (message && message !== '') {
      let gitApi = new Git()
      gitApi.commit(message, path).then(response => {
        this.props.refresh()
      })
    }
  }

  /** Update state of commit message input box */
  updateCommitBoxState(disable: boolean, numberOfFiles: number) {
    if (disable) {
      if (numberOfFiles === 0) {
        return classes(stagedCommitButtonStyle, stagedCommitButtonDisabledStyle)
      } else {
        return classes(stagedCommitButtonStyle, stagedCommitButtonReadyStyle)
      } 
    } else {
      return stagedCommitButtonStyle
    }
  }

  /** Switch current working branch */
  switchBranch(branchName: string) {
    let gitApi = new Git()
    // if (event.target.value === '') {
    //   let input = new Widget({ node: document.createElement('input') })
    //   showDialog(
    //     {        
    //       title: 'Input a name to create a new branch and switch to it:',
    //       body: input,
    //       focusNodeSelector: 'input',
    //       buttons: [Dialog.cancelButton(), 
    //       Dialog.okButton({ label: 'Create'})]
    //     }
    //   ).then(result => {
    //     let targetBranch = (input.node as HTMLInputElement).value 
    //     if (result.button.accept && targetBranch) {
    //       gitApi.checkout(true, true, targetBranch, false, null, this.props.currentFileBrowserPath)
    //       .then(response => {
    //         refresh()
    //       })
    //     }
    //   })
    // } else {
    gitApi.checkout(true, false, branchName, false, null, this.props.currentFileBrowserPath)
    .then(respones => {
      this.props.refresh()
    })
    // }
  }

  createNewBranch(branchName: string) {
    let gitApi = new Git()
    gitApi.checkout(true, true, branchName, false, null, this.props.currentFileBrowserPath)
    .then(response => {
      this.props.refresh()
    })
  }

  toggleSelect() {
    this.props.refresh()
    if (!this.props.disabled) {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen,
        showCommitBox: !this.state.showCommitBox
      })
    }
  }

  toggleNewBranchBox() {
    this.props.refresh()
    this.setState({
      showNewBranchBox: !this.state.showNewBranchBox,
      showCommitBox: false
    })
  }

  render() {
    return (
      <div className={branchStyle}>
        <button className={openHistorySideBarButtonStyle} onClick={() => this.props.toggleSidebar()}>
          History
        </button>
        <h3 className={branchLabelStyle}>
          {this.props.currentBranch}
        </h3>
        <a className={this.props.disabled ? 
            classes(headerButtonStyle, headerButtonDisabledStyle) 
          : headerButtonStyle} 
          onClick={() => this.toggleSelect()}
        >
          Change
        </a>
        <a className={this.props.disabled ? 
            classes(headerButtonStyle, headerButtonDisabledStyle) 
          : headerButtonStyle} 
          onClick={() => this.toggleNewBranchBox()}
        >
          New
        </a>
        {this.state.dropdownOpen &&
          <div>
            {this.props.data.map((branch, branchIndex) => {
                  return (
                    <li className={branchListItemStyle} key={branchIndex} onClick={() => this.switchBranch(branch.name)}>
                      {branch.name}
                    </li>
                  )
                })
              }
          </div>
        }
        {this.state.showCommitBox && 
          <CommitBox
            checkReadyForSubmit={this.updateCommitBoxState}
            stagedFiles={this.props.stagedFiles}
            commitAllStagedFiles={this.commitAllStagedFiles}
            topRepoPath={this.props.topRepoPath}
            refresh={this.props.refresh}
          />
        }
        {this.state.showNewBranchBox && 
          <NewBranchBox
            createNewBranch={this.createNewBranch}
          />
        }
      </div>
    )
  }
}




