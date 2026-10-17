---
id: indefinite-integral
title: Неопределённый интеграл: замена и интегрирование по частям
level: 2
module: Математический анализ: интегралы
hours: 6
prereq: derivative, integral-school
summary: Полная таблица интегралов, подведение под знак дифференциала, замена переменной, интегрирование по частям и «циклические» интегралы.
---

## Определение и свойства

$$\int f(x)\,dx=F(x)+C\iff F'(x)=f(x).$$

Свойства: $\left(\int f\,dx\right)'=f$; $\int dF=F+C$; интеграл суммы — сумма интегралов; константа выносится. А вот интеграла произведения «по отдельности» не бывает — для этого и нужны методы.

Дифференцирование — ремесло: по правилам находится производная любой элементарной функции. Интегрирование — искусство: нужно угадать, какой метод сработает, а некоторые интегралы (например, $\int e^{-x^2}dx$, $\int\frac{\sin x}xdx$) вообще не выражаются через элементарные функции.

## Таблица интегралов

:::formulas
- $\int x^a dx=\dfrac{x^{a+1}}{a+1}+C,\ a\ne-1$ — степенная
- $\int\dfrac{dx}x=\ln|x|+C$ — логарифм
- $\int a^xdx=\dfrac{a^x}{\ln a}+C$ — показательная
- $\int\sin x\,dx=-\cos x+C,\ \int\cos x\,dx=\sin x+C$ — тригонометрия
- $\int\dfrac{dx}{\cos^2x}=\tg x+C,\ \int\dfrac{dx}{\sin^2x}=-\ctg x+C$
- $\int\dfrac{dx}{a^2+x^2}=\dfrac1a\arctg\dfrac xa+C$ — арктангенс
- $\int\dfrac{dx}{x^2-a^2}=\dfrac{1}{2a}\ln\left|\dfrac{x-a}{x+a}\right|+C$ — «высокий логарифм»
- $\int\dfrac{dx}{\sqrt{a^2-x^2}}=\arcsin\dfrac xa+C$ — арксинус
- $\int\dfrac{dx}{\sqrt{x^2\pm a^2}}=\ln\left|x+\sqrt{x^2\pm a^2}\right|+C$ — «длинный логарифм»
- $\int u\,dv=uv-\int v\,du$ — интегрирование по частям
:::

## Подведение под знак дифференциала

Если под интегралом есть функция и (с точностью до множителя) её производная, удобно «внести» производную под $d$:
$$\int f\big(\varphi(x)\big)\varphi'(x)\,dx=\int f(\varphi)\,d\varphi.$$

Полезные равенства: $x\,dx=\frac12d(x^2)$, $\cos x\,dx=d(\sin x)$, $\frac{dx}x=d(\ln x)$, $e^xdx=d(e^x)$, $dx=\frac1kd(kx+b)$.

:::example Найдите $\int xe^{x^2}dx$.
$\frac12\int e^{x^2}d(x^2)=\frac12e^{x^2}+C$.
:::

:::example Найдите $\int\tg x\,dx$.
$\int\frac{\sin x}{\cos x}dx=-\int\frac{d(\cos x)}{\cos x}=-\ln|\cos x|+C$.
:::

## Замена переменной

Более общий приём: $x=\varphi(t)$, $dx=\varphi'(t)dt$. Цель — упростить подынтегральное выражение. После интегрирования возвращаемся к $x$.

:::example Найдите $\int\dfrac{dx}{1+\sqrt x}$.
$\sqrt x=t$, $x=t^2$, $dx=2t\,dt$: $\int\frac{2t\,dt}{1+t}=2\int\left(1-\frac1{1+t}\right)dt=2t-2\ln(1+t)+C=2\sqrt x-2\ln(1+\sqrt x)+C$.
:::

## Интегрирование по частям

Из формулы $(uv)'=u'v+uv'$:
$$\int u\,dv=uv-\int v\,du.$$
Выбираем $u$ так, чтобы оно упрощалось при дифференцировании, а $dv$ — чтобы легко интегрировалось.

| Вид интеграла | $u$ | $dv$ |
|---|---|---|
| $\int P(x)e^{ax}dx$, $\int P(x)\sin ax\,dx$ | многочлен $P$ | остальное |
| $\int P(x)\ln x\,dx$, $\int P(x)\arctg x\,dx$ | $\ln x$, $\arctg x$ | $P(x)dx$ |

:::example Найдите $\int x\cos x\,dx$.
$u=x$, $dv=\cos x\,dx$, $du=dx$, $v=\sin x$: $x\sin x-\int\sin x\,dx=x\sin x+\cos x+C$.
:::

:::example Найдите $\int\ln x\,dx$.
$u=\ln x$, $dv=dx$: $x\ln x-\int x\cdot\frac1x\,dx=x\ln x-x+C$.
:::

**Циклические интегралы.** Иногда после двух интегрирований по частям возвращается исходный интеграл — тогда его находят из уравнения.

:::example Найдите $I=\int e^x\sin x\,dx$.
Дважды по частям: $I=e^x\sin x-\int e^x\cos x\,dx=e^x\sin x-e^x\cos x-I$. Отсюда $I=\frac{e^x(\sin x-\cos x)}{2}+C$.
:::

:::idea Проверка всегда возможна
Продифференцируйте ответ — должна получиться подынтегральная функция. Это занимает минуту и спасает от большинства ошибок. На сайте ответ к таким задачам проверяется с точностью до константы: «+ C» можно не писать.
:::

@tasks

@task antider 1
Найдите $\int\left(x^2+\dfrac{1}{x^2}\right)dx$.
@answer x^3/3 - 1/x
@solution
$\frac{x^3}3-\frac1x+C$.

@task antider 1
Найдите $\int xe^{x^2}dx$.
@answer e^(x^2)/2
@solution
См. теорию.

@task antider 2
Найдите $\int\cos x\sin^2x\,dx$.
@answer sin(x)^3/3
@solution
$\int\sin^2x\,d(\sin x)=\frac{\sin^3x}3+C$.

@task antider 2
Найдите $\int x\cos x\,dx$.
@answer x*sin(x)+cos(x)
@solution
По частям: $u=x$.

@task antider 2
Найдите $\int\ln x\,dx$.
@answer x*ln(x)-x
@solution
По частям: $u=\ln x$, $dv=dx$.

@task antider 2
Найдите $\int\dfrac{dx}{1+4x^2}$.
@answer arctg(2x)/2
@solution
$\frac12\int\frac{d(2x)}{1+(2x)^2}=\frac12\arctg2x+C$.

@task antider 3
Найдите $\int x^2e^xdx$.
@answer e^x*(x^2-2x+2)
@solution
Дважды по частям: $x^2e^x-2\int xe^xdx=x^2e^x-2(xe^x-e^x)+C$.

@task antider 3
Найдите $\int e^x\sin x\,dx$.
@answer e^x*(sin(x)-cos(x))/2
@solution
См. теорию: циклический интеграл.

@task antider 2
Найдите $\int\dfrac{dx}{x\ln x}$ (при $x>1$).
@answer ln(ln(x))
@range 1.5 4
@solution
$\int\frac{d(\ln x)}{\ln x}=\ln|\ln x|+C$.

@task antider 2
Найдите $\int\dfrac{dx}{\sqrt{4-x^2}}$.
@answer arcsin(x/2)
@range -1.5 1.5
@solution
Табличный: $\arcsin\frac x2+C$.

@task antider 3
Найдите $\int\arctg x\,dx$.
@answer x*arctg(x) - ln(1+x^2)/2
@solution
$u=\arctg x$, $dv=dx$: $x\arctg x-\int\frac{x\,dx}{1+x^2}=x\arctg x-\frac12\ln(1+x^2)+C$.
