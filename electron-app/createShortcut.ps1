$desktop = [System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), 'MyElectronApp.lnk')
$targetPath = "C:\Windows\System32\cmd.exe"
$arguments = '/c "npx electron C:\Users\Dylan\electron-app"'

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($desktop)
$shortcut.TargetPath = $targetPath
$shortcut.Arguments = $arguments
$shortcut.WorkingDirectory = "C:\Users\Dylan\electron-app"
$shortcut.IconLocation = $targetPath
$shortcut.Save()
