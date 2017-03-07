'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {VerificationResult, VerificationResults} from './verificationResults';
import {ServerStatus} from './serverStatus';
import {VerificationRequest} from './VerificationRequest';
import {Context} from './Context';

export class Statusbar {

    public pid : Number;

    //used to display information about the progress of verification
    private serverStatusBar: vscode.StatusBarItem = null;

    //used to display typing/verifying/error count status
    private currentDocumentStatucBar: vscode.StatusBarItem = null;

    private static CurrentDocumentStatusBarVerified = "$(thumbsup) Verified";
    private static CurrentDocumentStatusBarNotVerified = "$(thumbsdown) Not verified";

    public activeRequest : VerificationRequest;
    private serverStatus : string;
    private queueSize : Number = 0;

    constructor(private context : Context) {
        this.currentDocumentStatucBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
        this.serverStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
    }

    private verificationResultToString (res: VerificationResult): string {
        switch(res){
            case VerificationResult.Verified: return Statusbar.CurrentDocumentStatusBarVerified;
            case VerificationResult.NotVerified: return Statusbar.CurrentDocumentStatusBarNotVerified;
        }
        return "$(x) Verification technical error";
    }

    public hide() {
        this.serverStatusBar.hide();
        this.currentDocumentStatucBar.hide();
    }

    public remainingRequests() : Number {
        let inst = this;
        /*return Object.keys(this.context.queuedRequests).filter((k) => {
                return !!(inst.context.activeRequest[k]);
            }).length;*/
        return -1;
    }


    public update()  {

        let editor = vscode.window.activeTextEditor;
        //editor.document is a get() that can try to resolve an undefined value
        let editorsOpen = vscode.window.visibleTextEditors.length;
        if (!editor || editorsOpen == 0 || editor.document.languageId !== 'dafny') {
            //disable UI on other doc types or when vscode.window.activeTextEditor is undefined
            this.serverStatusBar.hide();
            this.currentDocumentStatucBar.hide();
            return;
        }

        
        if(this.pid) {
            this.serverStatusBar.text = "$(up) Server up";
            this.serverStatusBar.text += " (pid " + this.pid + ")";
            this.serverStatusBar.text += " | " + this.serverStatus + " | ";
            this.serverStatusBar.text += "Queue: " + this.remainingRequests() + " |";
        } else {
            this.serverStatusBar.text = "$(x) Server down";
        }
        
        if (this.activeRequest && editor.document === this.activeRequest.doc) {
            this.currentDocumentStatucBar.text = ServerStatus.StatusBarVerifying.message;
        } else if (this.context.queuedRequests[editor.document.fileName]) {
            this.currentDocumentStatucBar.text = "$(watch) Queued";
        } else {
            let res: undefined | VerificationResult = this.context.verificationResults.latestResults[editor.document.fileName];
            if (res !== undefined) {
                this.currentDocumentStatucBar.text = this.verificationResultToString(res);
            } else {
                this.currentDocumentStatucBar.text = "Error";
            }
        }
        
        this.serverStatusBar.show();
        this.currentDocumentStatucBar.show();
        
    }

    public changeServerStatus(status : string) {
        this.serverStatus = status;
        this.update();
    }
}