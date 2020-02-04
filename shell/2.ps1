## 定义应用程序池名称
$AppPoolName = "DefaultAppPool"
write-output "开始停止应用程序池"
## 获取应用程序池的状态
$status = Get-WebAppPoolState -Name $AppPoolName  -ErrorAction "SilentlyContinue" | ForEach-Object {$_.Value}
write-output $status
If ($status -eq "Stopped") {
    Start-WebAppPool -Name $AppPoolName -ErrorAction "SilentlyContinue"
    If (!$?)
    {
    "发生异常，异常信息为$($error[0])";
    exit 1
    }
}
write-output "结束停止应用程序池"
exit 0
